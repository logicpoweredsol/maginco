using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Repositories
{
    interface IGenericRepository<T> where T : class
    {
        T Add(T obj);

        bool Remove(int id);

        List<T> GetAll();

        T GetByID(int id);
    }
}
