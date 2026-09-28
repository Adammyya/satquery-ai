from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class Evidence(BaseModel):
    type: str
    description: str
    spatial_evidence_available: bool = False
    requirements_status: Optional[str] = None
    overlay: Optional[Any] = None

class Execution(BaseModel):
    model: str
    workflow: str
    agents: List[str]
    latency_ms: Optional[int] = None

class TraceEvent(BaseModel):
    stage: str
    label: str
    detail: str
    timestamp: str
    type: str = "success"

class AnalysisResponse(BaseModel):
    task: str
    workflow: str
    answer: str
    confidence: Optional[float] = None
    uncertainty: str
    evidence: Evidence
    trace_events: List[TraceEvent]
    execution: Execution
    image: Optional[Dict[str, Any]] = None
    image2: Optional[Dict[str, Any]] = None

class Query(BaseModel):
    query: str
