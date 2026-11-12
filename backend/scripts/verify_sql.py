from backend.config import settings
import pyodbc

conn_str = (
    f"DRIVER={{ODBC Driver 18 for SQL Server}};"
    f"SERVER={settings.DB_SERVER};"
    f"DATABASE={settings.DB_DATABASE};"
    f"Trusted_Connection={settings.DB_TRUSTED_CONNECTION};"
)
try:
    cnxn = pyodbc.connect(conn_str, timeout=5)
    print('✅ Conexión exitosa')
    cnxn.close()
except Exception as e:
    print('❌ Error:', e)
