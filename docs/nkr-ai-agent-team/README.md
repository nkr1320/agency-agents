# NKR AI Agent Team — Design, Build, Evaluate, Operate

**Status:** Draft operational specification. Neither runtime connections nor real agent evaluations have been performed by these documents.  
**Mission:** Deliver usable AI assistants and automation systems with measurable performance, bounded tools, explicit ownership and human approval for consequential actions.

## Services

1. **AI Agent Development:** customer support, appointment/booking, internal knowledge, business workflows and approved custom assistants.
2. **RAG/Knowledge Assistants:** retrieval pipelines with citations, document access controls and test collections.
3. **Multi-Agent Workflows:** cooperating planner, executor, verifier and human handoff with explicit task states and limits.
4. **AI Agent Testing & Evaluation:** stand-alone assessments of client assistants, retrieval quality, failure modes, tool reliability and regression risk.
5. **Maintenance:** authorized prompt/tool/model updates, regression evaluation, usage and error monitoring.

**Commercial starting wedge:** a bounded AI Agent Evaluation engagement. Proposed validation range: INR 10,000–25,000 per engagement, depending on scope; **not a market quote or guaranteed earning**. Building and operating agent systems is a separate project estimate, including third-party model/API costs.

## Roles — selected source files, not a working deployment

| NKR role | Existing role file | Required deliverable |
| --- | --- | --- |
| Client intake and solution scoping | [Senior Project Manager](../../project-management/project-manager-senior.md) | written objective, authorized workflows, data and tool scope |
| Agent architect | [Multi-Agent Systems Architect](../../engineering/engineering-multi-agent-systems-architect.md) | agent graph, state, handoff, trust boundaries and failure recovery |
| Agent developer | [AI Engineer](../../engineering/engineering-ai-engineer.md) | versioned prompts/tools/integration code, tests |
| RAG specialist (optional) | [RAG Pipeline Engineer](../../engineering/engineering-rag-pipeline-engineer.md) | index strategy, retrieval policies and citations |
| API/tool integration tester | [API Tester](../../testing/testing-api-tester.md) | testable tool contracts and execution evidence |
| Quality/evaluation lead | [Test Results Analyzer](../../testing/testing-test-results-analyzer.md) + [Evidence Collector](../../testing/testing-evidence-collector.md) | reproducible test-case and error ledger |
| Security/privacy reviewer | [AI-generated Code Auditor](../../security/security-ai-generated-code-auditor.md) + [Privacy Engineer](../../engineering/engineering-privacy-engineer.md) | permission and data-leakage assessment |
| Delivery/reporting | [Technical Writer](../../engineering/engineering-technical-writer.md) | limitations, operational handbook and acceptance report |

Use only necessary roles per job. A single specialist may be sufficient; **number of agents is not evidence of quality**.

### Existing ECC helpers to assess separately

- [ECC agent evaluator](https://github.com/nkr1320/ECC/blob/main/agents/agent-evaluator.md): evaluation rubric.
- [ECC RAG pipeline reviewer](https://github.com/nkr1320/ECC/blob/main/agents/rag-pipeline-reviewer.md): retrieval inspection.
- [ECC security reviewer](https://github.com/nkr1320/ECC/blob/main/agents/security-reviewer.md): security checklist.
- [NKR Promptfoo fork](https://github.com/nkr1320/nkr-agent-evals): candidate repeatable prompt/model regression engine.

Pin exact versions, benchmark before integration, and **avoid duplicate ECC hooks or unreviewed automatic tool permissions**.

## Flow

Authorized brief -> use-case specification -> tool/data permission matrix -> prompt and workflow design -> implementation in isolated branch -> golden-set evaluation + adversarial/boundary tests -> independent code/data/privacy review -> monitored staging pilot -> owner/client acceptance -> explicitly approved production rollout -> change control and periodic regression tests.

## Non-negotiable controls

- No production financial transactions, messages, record deletion, account mutation or external publishing unless the user/client explicitly approves that type of action and its execution scope.
- Prompt injection from websites, tools, documents or user input is untrusted; tool allowlists and server-enforced authorization are required.
- Secrets, credentials and personally identifiable data never belong in test prompts, public repositories or publicly accessible traces.
- Tools use least privilege and isolated service accounts; privileged writes require a separate authorization gate.
- Measure actual correctness, refusal/abstention behavior, tool call success, retrieval/citation support, cost and latency.
- Unknown / untested does not mean pass. No invented evaluation scores, screenshots or customer outcomes.
- Human review is required for sensitive workflows and initial deployments.

## Dependencies and operating model

Use existing GitHub branching, code review and CI. Consider **one** primary orchestration manager if real coordination metrics justify it; do not combine Orchestrator, OpenHands and Paperclip by default. Keep client-specific memory/knowledge bases logically isolated.

See [agent contracts](AGENT_CONTRACTS.md) and [evaluation and handover templates](EVALUATION.md).

**Not included:** running client agents, actual evaluations, live integrations, a dashboard, or production releases.
