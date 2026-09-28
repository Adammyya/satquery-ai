def route_task(query: str) -> str:
    """
    Route the user's natural language query to the appropriate agent workflow.
    """
    query_lower = query.lower()
    
    if "sar" in query_lower or "radar" in query_lower:
        return "optical_sar_agent"

    if "change" in query_lower or "before" in query_lower:
        return "temporal_change_agent"
        
    if "where" in query_lower or "locate" in query_lower:
        return "grounding_agent"
        
    if "describe scene" in query_lower or "scene understanding" in query_lower:
        return "scene_agent"
        
    return "vqa_agent"
