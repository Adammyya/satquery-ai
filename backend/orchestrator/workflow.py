from datetime import datetime, timezone

from orchestrator.router import route_task
from agents.vqa_agent import run_vqa
from services.gemini_service import GEMINI_MODEL


class WorkflowContext:
    def __init__(self, query: str, image_filename: str):
        self.query = query
        self.image_filename = image_filename
        self.trace_events = []

    def log_event(self, stage: str, detail: str):
        self.trace_events.append({
            "stage": stage,
            "label": stage,
            "detail": detail,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "type": "success",
        })


def execute_workflow(
    query: str,
    image_bytes: bytes,
    mime_type: str,
    image_filename: str,
    image2_bytes: bytes = None,
    mime_type2: str = None,
    image2_filename: str = None,
) -> dict:
    ctx = WorkflowContext(query, image_filename)

    ctx.log_event(
        "INPUT RECEIVED",
        f"Query ingested: '{query.strip()[:60]}...'",
    )
    ctx.log_event(
        "IMAGE VALIDATED",
        f"Validated format ({mime_type.split('/')[-1].upper()})",
    )

    if image2_bytes:
        ctx.log_event(
            "SECOND IMAGE VALIDATED",
            f"Observation T2 validated ({(mime_type2 or 'image/jpeg').split('/')[-1].upper()})",
        )

    ctx.log_event(
        "QUERY INTERPRETED",
        "Determining remote-sensing task parameters",
    )

    agent_target = route_task(query)

    ctx.log_event(
        "TASK ROUTED",
        f"Task routed to {agent_target}",
    )

    if agent_target in [
        "vqa_agent",
        "scene_agent",
        "grounding_agent",
        "temporal_change_agent",
        "optical_sar_agent",
    ]:
        ctx.log_event(
            "AGENT SELECTED",
            f"{agent_target.replace('_', ' ').title()} selected",
        )

        if agent_target == "grounding_agent":
            ctx.log_event(
                "MODEL ANALYSIS",
                f"Executing analytical evaluation via {GEMINI_MODEL}",
            )

            from agents.grounding_agent import run_grounding

            result = run_grounding(
                query,
                image_bytes,
                mime_type,
                image_filename,
            )

            task_name = "spatial_grounding"
            workflow_name = "Spatial Feature Grounding"

        elif agent_target == "temporal_change_agent":
            ctx.log_event(
                "TEMPORAL ALIGNMENT",
                "Verifying multi-temporal observation pair",
            )

            if not image2_bytes:
                ctx.log_event(
                    "OBSERVATION T2",
                    "Second temporal observation is required",
                )

            from agents.temporal_agent import run_temporal

            result = run_temporal(
                query,
                image_bytes,
                mime_type,
                image_filename,
                image2_bytes,
                mime_type2,
                image2_filename,
            )

            task_name = "temporal_change_detection"
            workflow_name = "Temporal Difference Analysis"

            if image2_bytes:
                ctx.log_event(
                    "CHANGE ANALYSIS",
                    "Evaluating temporal variance between T1 and T2",
                )
            else:
                ctx.log_event(
                    "CHANGE ANALYSIS",
                    "Temporal comparison paused because Observation T2 is missing",
                )

        elif agent_target == "optical_sar_agent":
            ctx.log_event(
                "OPTICAL ANALYSIS",
                "Extracting visual spectral features",
            )
            ctx.log_event(
                "SAR ANALYSIS",
                "Awaiting active microwave backscatter data",
            )

            from agents.optical_sar_agent import run_optical_sar

            result = run_optical_sar(
                query,
                image_bytes,
                mime_type,
                image_filename,
            )

            task_name = "multimodal_analysis"
            workflow_name = "Optical-SAR Fusion"

            ctx.log_event(
                "MULTIMODAL FUSION",
                "Attempting cross-sensor correlation",
            )

        else:
            ctx.log_event(
                "MODEL ANALYSIS",
                f"Executing analytical evaluation via {GEMINI_MODEL}",
            )

            result = run_vqa(
                query,
                image_bytes,
                mime_type,
                image_filename,
            )

            task_name = (
                "satellite_vqa"
                if agent_target == "vqa_agent"
                else "scene_description"
            )
            workflow_name = "Single Image VQA"

        if agent_target == "temporal_change_agent":
            ctx.log_event(
                "CHANGE EVIDENCE",
                f"Diagnostic features extracted ({result['evidence'].get('type', 'VISUAL')})",
            )
        else:
            ctx.log_event(
                "EVIDENCE GENERATED",
                f"Diagnostic features extracted ({result['evidence'].get('type', 'VISUAL')})",
            )

        ctx.log_event(
            "EXPLANATION GENERATED",
            "Final answer formulated",
        )

        confidence = result["confidence"]
        conf_str = (
            f"{int(confidence * 100)}%"
            if confidence is not None
            else "N/A"
        )

        ctx.log_event(
            "RESULT READY",
            f"Confidence: {conf_str} | Task: {task_name.upper()}",
        )

        return {
            "task": task_name,
            "workflow": workflow_name,
            "answer": result["answer"],
            "confidence": result["confidence"],
            "uncertainty": result["uncertainty"],
            "evidence": result["evidence"],
            "trace_events": ctx.trace_events,
            "execution": {
                "model": GEMINI_MODEL,
                "workflow": workflow_name,
                "agents": [agent_target],
            },
        }

    ctx.log_event(
        "AGENT SELECTED",
        f"{agent_target} selected",
    )
    ctx.log_event(
        "RESULT READY",
        f"Capability {agent_target} not fully implemented yet.",
    )

    return {
        "task": agent_target,
        "workflow": f"{agent_target} workflow",
        "answer": (
            f"The requested analysis requires the '{agent_target}', "
            "which requires additional data (e.g. SAR or Temporal) "
            "not currently available in the single-image demo."
        ),
        "confidence": None,
        "uncertainty": "Data requirements not met.",
        "evidence": {
            "type": "METADATA",
            "description": "Missing required data.",
            "spatial_evidence_available": False,
            "requirements_status": (
                "Additional data required for this agent."
            ),
        },
        "trace_events": ctx.trace_events,
        "execution": {
            "model": "Orchestrator",
            "workflow": f"{agent_target} workflow",
            "agents": [agent_target],
        },
    }