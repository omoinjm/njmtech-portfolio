using Dapper;
using Npgsql;
using NTech.Shared.Core;

namespace NTech.Shared.Database
{
    public class PgSelector(string connectionString) : IPgSelector
    {
        private readonly string _connectionString = connectionString;

        public List<T> Select<T>(string query, object? parameters = null)
        {
            using var db = new NpgsqlConnection(_connectionString);
            return db.Query<T>(query, parameters).ToList();
        }
    }
}
