using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SampleWebsite.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    //[Route("api/[controller]/{id}")]
    public class DataController : ApiController
    {
        /// <summary>
        /// データストア用辞書
        /// </summary>
        private static Dictionary<string, string> DataStore = new Dictionary<string, string>();

        // GET: api/values
        [HttpGet]
        public IEnumerable<object> Get()
        {
            return DataStore.Select(keyValue => new { keyValue.Key, keyValue.Value });
        }

        // GET api/values/AnyId
        //[HttpGet("{id}")]
        public string GetById(string id)
        {
            if (DataStore.ContainsKey(id))
            {
                return DataStore[id];
            }
            else
            {
                return null;
            }
        }

        // POST api/values
        [HttpPost]
        public void Post(string id, [FromBody]dynamic value)
        {
            DataStore[id] = value.ToString();
        }
    }
}
