"""No-dependency regression tests for static NKR Agency OS policy validation."""
import copy
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from nkr_agency_validate import validate, validate_policy, validate_team  # noqa: E402


class EnterpriseAgencyManifestTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.policy = json.loads((ROOT / "nkr-agency/policies/governance.json").read_text(encoding="utf-8"))
        cls.website = json.loads((ROOT / "nkr-agency/teams/website.json").read_text(encoding="utf-8"))

    def test_all_three_real_manifests(self):
        self.assertEqual(validate(ROOT), [])

    def test_bad_phase_lead_blocked(self):
        config = copy.deepcopy(self.website)
        config["phases"][0]["lead"] = "nonexistent"
        errors = validate_team(config, self.policy, ROOT, "website")
        self.assertTrue(any("unknown lead" in error for error in errors), errors)

    def test_missing_execution_evidence_blocked(self):
        config = copy.deepcopy(self.website)
        config["phases"][5]["evidence"] = []
        errors = validate_team(config, self.policy, ROOT, "website")
        self.assertTrue(any("missing evidence" in error for error in errors), errors)

    def test_wrong_gate_blocked(self):
        config = copy.deepcopy(self.website)
        config["phases"][7]["gate"] = "MADE_UP_RELEASE"
        errors = validate_team(config, self.policy, ROOT, "website")
        self.assertTrue(any("incorrect governance gate" in error for error in errors), errors)

    def test_role_outside_repo_blocked(self):
        config = copy.deepcopy(self.website)
        config["roles"][0]["skill_ref"] = "../../outside.md"
        errors = validate_team(config, self.policy, ROOT, "website")
        self.assertTrue(any("missing markdown skill_ref" in error or "outside repo" in error for error in errors), errors)

    def test_unsafe_execution_controls_blocked(self):
        config = copy.deepcopy(self.website)
        config["execution"]["requires_independent_release_approval"] = False
        errors = validate_team(config, self.policy, ROOT, "website")
        self.assertTrue(any("risk controls not enabled" in error for error in errors), errors)

    def test_policy_tiers_checked(self):
        config = copy.deepcopy(self.policy)
        config["risk_tiers"][1]["id"] = "R0"
        self.assertTrue(any("R0-R3" in error for error in validate_policy(config)))


if __name__ == "__main__":
    unittest.main()
