#!/usr/bin/env python3
"""Validate static NKR Agency OS role/phase/governance manifests.

This is a static completeness check, NOT runtime permission enforcement,
a security audit, proof of agent execution, or certification.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEAMS = ("website", "agents", "app")
REQUIRED_FIELDS = ("schema_version", "id", "name", "roles", "phases", "metrics", "maintenance", "standards", "execution")


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def validate_policy(policy: dict) -> list[str]:
    errors = []
    if policy.get("schema_version") != 1:
        errors.append("governance: unsupported schema_version")
    for key in ("required_phase_ids", "required_gates", "risk_tiers", "controls", "dangerous_actions"):
        if not isinstance(policy.get(key), list) or not policy[key]:
            errors.append(f"governance: missing/empty {key}")
    phases = policy.get("required_phase_ids", [])
    gates = policy.get("required_gates", [])
    if len(phases) != 10 or len(set(phases)) != len(phases):
        errors.append("governance: expected ten unique phases")
    if len(gates) != len(phases) or len(set(gates)) != len(gates):
        errors.append("governance: gates must be unique and match phase count")
    if not policy.get("release_policy"):
        errors.append("governance: missing release_policy")
    control_ids = [c.get("id") for c in policy.get("controls", []) if isinstance(c, dict)]
    if len(control_ids) != len(set(control_ids)) or any(not x for x in control_ids):
        errors.append("governance: invalid or duplicate control ID")
    tiers = policy.get("risk_tiers", [])
    tier_ids = [x.get("id") for x in tiers if isinstance(x, dict)]
    if tier_ids != ["R0", "R1", "R2", "R3"]:
        errors.append("governance: expected ordered R0-R3 tiers")
    if any(not isinstance(t.get("min_approvals"), int) or t["min_approvals"] < 1 for t in tiers if isinstance(t, dict)):
        errors.append("governance: every tier must have positive approval count")
    return errors


def validate_team(team: dict, policy: dict, root: Path, file_id: str) -> list[str]:
    errors = []
    prefix = file_id + ": "
    for field in REQUIRED_FIELDS:
        if field not in team:
            errors.append(prefix + f"missing {field}")
    if team.get("schema_version") != 1 or team.get("id") != file_id:
        errors.append(prefix + "unexpected schema version or ID")
    roles = team.get("roles", [])
    role_ids: set[str] = set()
    if not isinstance(roles, list) or not roles:
        errors.append(prefix + "roles missing/empty")
        roles = []
    for role in roles:
        if not isinstance(role, dict):
            errors.append(prefix + "role entry not an object")
            continue
        role_id = role.get("id")
        if not isinstance(role_id, str) or not role_id or role_id in role_ids:
            errors.append(prefix + f"role ID missing or duplicate: {role_id!r}")
        role_ids.add(role_id)
        ref = role.get("skill_ref")
        if not isinstance(ref, str) or not ref.endswith(".md"):
            errors.append(prefix + f"role {role_id}: missing markdown skill_ref")
        else:
            safe = (root / ref).resolve()
            try:
                safe.relative_to(root.resolve())
            except ValueError:
                errors.append(prefix + f"role {role_id}: skill reference outside repo")
            else:
                if not safe.is_file():
                    errors.append(prefix + f"role {role_id}: missing skill reference {ref}")
        if not isinstance(role.get("responsibility"), str) or not role["responsibility"].strip():
            errors.append(prefix + f"role {role_id}: missing responsibility")
    steps = team.get("phases", [])
    expected = policy.get("required_phase_ids", [])
    gates = policy.get("required_gates", [])
    if not isinstance(steps, list) or len(steps) != len(expected):
        errors.append(prefix + "phase count does not match policy")
        steps = []
    if [p.get("id") for p in steps if isinstance(p, dict)] != expected:
        errors.append(prefix + "phase order or IDs differ from policy")
    for i, p in enumerate(steps):
        if not isinstance(p, dict):
            errors.append(prefix + f"phase {i}: not an object")
            continue
        if p.get("lead") not in role_ids:
            errors.append(prefix + f"phase {p.get('id')}: unknown lead role {p.get('lead')}")
        if i >= len(gates) or p.get("gate") != gates[i]:
            errors.append(prefix + f"phase {p.get('id')}: incorrect governance gate")
        for k in ("required_artifacts", "evidence"):
            v = p.get(k)
            if not isinstance(v, list) or not v or any(not isinstance(s, str) or not s.strip() for s in v):
                errors.append(prefix + f"phase {p.get('id')}: missing {k}")
    for k in ("metrics", "maintenance", "standards"):
        v = team.get(k)
        if not isinstance(v, list) or not v or any(not isinstance(s, str) or not s.strip() for s in v):
            errors.append(prefix + f"missing/invalid {k}")
    required_roles = {"reviewer", "security", "ops"}
    if not required_roles.issubset(role_ids):
        errors.append(prefix + "missing essential independent review/security/ops roles")
    execution = team.get("execution", {})
    if not isinstance(execution, dict) or not (
        execution.get("requires_isolated_worktrees") is True
        and execution.get("requires_independent_release_approval") is True
        and execution.get("client_data_isolation") is True
        and execution.get("model_tool_calls_untrusted") is True
    ):
        errors.append(prefix + "minimum execution risk controls not enabled")
    if not isinstance(execution.get("default_concurrency"), int) or not 1 <= execution["default_concurrency"] <= 3:
        errors.append(prefix + "default_concurrency must be 1–3 for initial pilots")
    return errors


def validate(root: Path = ROOT) -> list[str]:
    root = root.resolve()
    errors = []
    try:
        policy = load_json(root / "nkr-agency/policies/governance.json")
    except (OSError, ValueError) as exc:
        return [f"governance: cannot load JSON: {exc}"]
    if not isinstance(policy, dict):
        return ["governance: policy must be an object"]
    errors += validate_policy(policy)
    for team_id in TEAMS:
        try:
            config = load_json(root / f"nkr-agency/teams/{team_id}.json")
        except (OSError, ValueError) as exc:
            errors.append(f"{team_id}: cannot load JSON: {exc}")
            continue
        if not isinstance(config, dict):
            errors.append(f"{team_id}: manifest must be an object")
            continue
        errors += validate_team(config, policy, root, team_id)
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Check three NKR division manifests and governance schema")
    parser.add_argument("--root", type=Path, default=ROOT, help="repository checkout root")
    args = parser.parse_args()
    errors = validate(args.root)
    if errors:
        for issue in errors:
            print("ERROR:", issue)
        print(f"FAIL: {len(errors)} manifest issue(s). Runtime enforcement NOT assessed.")
        return 1
    print("PASS: 3 team manifests, role references, ten phases and governance structure validated.")
    print("LIMITATION: this check does NOT execute agents, verify security controls or approve deployments.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
