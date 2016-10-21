using DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        AuthDbContext dbContext;
        DbSet<T> dbSet;

        public GenericRepository()
        {
            dbContext = new AuthDbContext();
            dbSet = dbContext.Set<T>();
        }

        public T Add(T obj)
        {
            var newObj = dbSet.Add(obj);

            return SaveChanges() > 0 ? newObj : null;
        }

        public List<T> GetAll()
        {
            return dbSet.ToList<T>();
        }

        public T GetByID(int id)
        {
            return dbSet.Find(id);
        }

        public bool Remove(int id)
        {
            var toRemove = dbSet.Find(id);

            dbSet.Remove(toRemove);

            return SaveChanges() > 0;
        }

        public int SaveChanges()
        {
            return dbContext.SaveChanges();
        }
    }
}
