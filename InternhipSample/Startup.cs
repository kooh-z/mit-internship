using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(InternhipSample.Startup))]
namespace InternhipSample
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
