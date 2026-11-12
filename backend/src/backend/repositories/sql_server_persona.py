import pyodbc
from backend.schemas.personas import Persona, PersonaCreate, PersonaUpdate
from backend.config import settings

class SqlServerPersonaRepository:
    def __init__(self) -> None:
        conn_str = (
            f"DRIVER={{ODBC Driver 18 for SQL Server}};"
            f"SERVER={settings.DB_SERVER};"
            f"DATABASE={settings.DB_NAME};"
            f"Trusted_Connection={settings.DB_TRUSTED_CONNECTION};"
            f"Encrypt=no;"

        )
        self._cnxn = pyodbc.connect(conn_str)
        self._cnxn.autocommit = True

    def list(self) -> list[Persona]:
        cursor = self._cnxn.cursor()
        cursor.execute("SELECT dni, nombre, fechaNacimiento FROM dbo.Persona")
        rows = cursor.fetchall()
        return [
            Persona(dni=row.dni, nombre=row.nombre, fecha_nacimiento=row.fechaNacimiento)
            for row in rows
        ]

    def get(self, dni: str) -> Persona | None:
        cursor = self._cnxn.cursor()
        cursor.execute(
            "SELECT dni, nombre, fechaNacimiento FROM dbo.Persona WHERE dni = ?", dni
        )
        row = cursor.fetchone()
        if row:
            return Persona(dni=row.dni, nombre=row.nombre, fecha_nacimiento=row.fechaNacimiento)
        return None

    def exists(self, dni: str) -> bool:
        cursor = self._cnxn.cursor()
        cursor.execute("SELECT 1 FROM dbo.Persona WHERE dni = ?", dni)
        return cursor.fetchone() is not None

    def add(self, persona: Persona) -> Persona:
        cursor = self._cnxn.cursor()
        cursor.execute(
            "INSERT INTO dbo.Persona (dni, nombre, fechaNacimiento) VALUES (?,?,?)",
            persona.dni,
            persona.nombre,
            persona.fecha_nacimiento,
        )
        return persona

    def update(self, dni: str, datos: PersonaUpdate) -> Persona | None:
        cursor = self._cnxn.cursor()
        cursor.execute(
            "UPDATE dbo.Persona SET nombre = ?, fechaNacimiento = ? WHERE dni = ?",
            datos.nombre,
            datos.fecha_nacimiento,
            dni,
        )
        if cursor.rowcount == 0:
            return None
        return Persona(dni=dni, nombre=datos.nombre, fecha_nacimiento=datos.fecha_nacimiento)

    def delete(self, dni: str) -> bool:
        cursor = self._cnxn.cursor()
        cursor.execute("DELETE FROM dbo.Persona WHERE dni = ?", dni)
        return cursor.rowcount > 0
