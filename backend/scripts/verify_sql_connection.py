import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
from backend.config import settings
import pyodbc

conn_str = (
    f"DRIVER={{ODBC Driver 18 for SQL Server}};"
    f"SERVER={settings.DB_SERVER};"
    f"DATABASE={settings.DB_NAME};"
    f"Trusted_Connection={settings.DB_TRUSTED_CONNECTION};"
)

try:
    cnxn = pyodbc.connect(conn_str, timeout=5)
    print("✅ Conexión a SQL Server exitosa")
    cnxn.close()
except Exception as e:
    print("❌ Error al conectar:", e)
