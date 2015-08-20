using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace Internship2015.Controllers
{
    /// <summary>
    /// ヘルスケアプラットフォームのAPIを呼び出すためのコントローラです。
    /// </summary>
    public class HealthcareController : ApiController
    {
        /// <summary>
        /// フォワードAPIのパス
        /// </summary>
        private const string FwApi = "https://devhelp-dh-port.cloudapp.net/consumer/api/fw";

        /// <summary>
        /// Get APIリクエスト
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public HttpResponseMessage Get(string path)
        {
            return SendHcpfRequest();
        }

        /// <summary>
        /// Post APIリクエスト
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public HttpResponseMessage Post(string path)
        {
            return SendHcpfRequest();
        }


        /// <summary>
        /// ヘルスケアプラットフォームをリクエストを送信して結果を返します。
        /// </summary>
        /// <returns></returns>
        private HttpResponseMessage SendHcpfRequest()
        {
            var token = Request.Headers.GetValues("clientToken").First();
            if (string.IsNullOrEmpty(token))
            {

                return new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Content = new StringContent(@"{ ""error_description"" : ""ヘッダにクライアントトークンが指定されていません。"" }", Encoding.UTF8, "application/json")
                };
            }

            ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;

            HttpClient client = new HttpClient();

            client.DefaultRequestHeaders.Add("clientToken", token);
            client.DefaultRequestHeaders.Add("platformId", "HCPF");

            var httpRequestMessage = new HttpRequestMessage
            {
                Method = Request.Method,
                RequestUri = new Uri(FwApi + Request.RequestUri.PathAndQuery),
                Content = Request.Method == HttpMethod.Get ? null : Request.Content,
            };

            var response = client.SendAsync(httpRequestMessage).Result;

            var content = response.Content.ReadAsStringAsync().Result;

            return new HttpResponseMessage
            {
                StatusCode = response.StatusCode,
                Content = new StringContent(content, Encoding.UTF8, "application/json")
            };
        }
    }
}