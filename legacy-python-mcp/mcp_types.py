from pydantic import BaseModel
from typing import Dict, Any, List

class SchemaResponse(BaseModel):
    types: Dict[str, Any]

class MCPObject(BaseModel):
    type: str
    id: str
    properties: Dict[str, Any]

class ObjectResponse(BaseModel):
    objects: List[MCPObject]

class ToolParameter(BaseModel):
    type: str
    description: str

class Tool(BaseModel):
    name: str
    description: str
    parameters: Dict[str, ToolParameter]

class ToolsResponse(BaseModel):
    tools: List[Tool]
