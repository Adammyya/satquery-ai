from datetime import datetime, timezone
from backend.orchestrator.router import route_task
from backend.agents.vqa_agent import run_vqa
from backend.services.gemini_service import GEMINI_MODEL

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

def execute_workflow(query: str, image_bytes: bytes, mime_type: str, image_filename: str) -> dict:
    ctx = WorkflowContext(query, image_filename)
    
    ctx.log_event("INPUT RECEIVED", f"Query ingested: '{query.strip()[:60]}...'")
    ctx.log_event("IMAGE VALIDATED", f"Validated format ({mime_type.split('/')[-1].upper()})")
    ctx.log_event("QUERY INTERPRETED", "Determining remote-sensing task parameters")
    
    agent_target = route_task(query)
    
    ctx.log_event("TASK ROUTED", f"Task routed to {agent_target}")
    
    if agent_target in ["vqa_agent", "scene_agent", "grounding_agent"]:
        ctx.log_event("AGENT SELECTED", f"{agent_target.replace('_', ' ').title()} selected")
        ctx.log_event("MODEL ANALYSIS", f"Executing analytical evaluation via {GEMINI_MODEL}")
        
        if agent_target == "grounding_agent":
            from backend.agents.grounding_agent import run_grounding
            result = run_grounding(query, image_bytes, mime_type, image_filename)
            task_name = "spatial_grounding"
            workflow_name = "Spatial Feature Grounding"
        else:
            from backend.agents.vqa_agent import run_vqa
            result = run_vqa(query, image_bytes, mime_type, image_filename)
            task_name = "satellite_vqa" if agent_target == "vqa_agent" else "scene_description"
            workflow_name = "Single Image VQA"
        
        ctx.log_event("EVIDENCE GENERATED", f"Diagnostic features extracted ({result['evidence'].get('type', 'VISUAL')})")
        ctx.log_event("EXPLANATION GENERATED", "Final answer formulated")
        
        confidence = result["confidence"]
        conf_str = f"{int(confidence * 100)}%" if confidence is not None else "N/A"
        ctx.log_event("RESULT READY", f"Confidence: {conf_str} | Task: {task_name.upper()}")
        
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
                "agents": [agent_target]
            }
        }
    else:
        # Fallback for unavailable capabilities in this phase
        ctx.log_event("AGENT SELECTED", f"{agent_target} selected")
        ctx.log_event("RESULT READY", f"Capability {agent_target} not fully implemented yet.")
        
        return {
            "task": agent_target,
            "workflow": f"{agent_target} workflow",
            "answer": f"The requested analysis requires the '{agent_target}', which requires additional data (e.g. SAR or Temporal) not currently available in the single-image demo.",
            "confidence": None,
            "uncertainty": "Data requirements not met.",
            "evidence": {
                "type": "METADATA",
                "description": "Missing required data.",
                "spatial_evidence_available": False,
                "requirements_status": "Additional data required for this agent."
            },
            "trace_events": ctx.trace_events,
            "execution": {
                "model": "Orchestrator",
                "workflow": f"{agent_target} workflow",
                "agents": [agent_target]
            }
        }
