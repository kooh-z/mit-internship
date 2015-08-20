using System.Web.Http;

namespace InternhipSample
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API の設定およびサービス

            // Web API ルート
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "HealthcareApi",
                routeTemplate: "api/{*path}",
                defaults: new
                {
                    controller = "Healthcare"
                }
            );
        }
    }
}
