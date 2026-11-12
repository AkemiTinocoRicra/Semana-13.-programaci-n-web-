from backend.schemas.personas import Persona, PersonaUpdate


class PersonaRepository:
    """Almacenamiento de personas en memoria, indexado por DNI.

    Los datos viven durante la vida del proceso: se pierden al reiniciar el
    servidor. Es la única capa que conoce la estructura de almacenamiento.
    """

    def __init__(self) -> None:
        self._personas: dict[str, Persona] = {}

    def list(self) -> list[Persona]:
        return list(self._personas.values())

    def get(self, dni: str) -> Persona | None:
        return self._personas.get(dni)

    def exists(self, dni: str) -> bool:
        return dni in self._personas

    def add(self, persona: Persona) -> Persona:
        self._personas[persona.dni] = persona
        return persona

    def update(self, dni: str, datos: PersonaUpdate) -> Persona | None:
        if dni not in self._personas:
            return None

        actualizada = Persona(dni=dni, **datos.model_dump())
        self._personas[dni] = actualizada
        return actualizada

    def delete(self, dni: str) -> bool:
        return self._personas.pop(dni, None) is not None


persona_repository = PersonaRepository()
