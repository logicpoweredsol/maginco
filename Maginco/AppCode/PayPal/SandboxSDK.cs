using PayPal.Api;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Maginco.AppCode.PayPal
{
    public class SandboxSDK
    {
        public void RunCode()
        {
            Dictionary<string, string> sdkConfig = new Dictionary<string, string>();
            sdkConfig.Add("mode", "sandbox");
            string accessToken = new OAuthTokenCredential(ConfigurationManager.AppSettings["PayPalAppId"], ConfigurationManager.AppSettings["PayPalAppSecret"], sdkConfig).GetAccessToken();
            APIContext apiContext = new APIContext(accessToken);
            apiContext.Config = sdkConfig;

            Amount amnt = new Amount();
            amnt.currency = "USD";
            amnt.total = "12";

            List<Transaction> transactionList = new List<Transaction>();
            Transaction tran = new Transaction();
            tran.description = "creating a payment";
            tran.amount = amnt;
            transactionList.Add(tran);

            Payer payr = new Payer();
            payr.payment_method = "paypal";

            RedirectUrls redirUrls = new RedirectUrls();
            redirUrls.cancel_url = "https://devtools-paypal.com/guide/pay_paypal/dotnet?cancel=true";
            redirUrls.return_url = "https://localhost:44394/";

            Payment pymnt = new Payment();
            pymnt.intent = "sale";
            pymnt.payer = payr;
            pymnt.transactions = transactionList;
            pymnt.redirect_urls = redirUrls;

            Payment createdPayment = pymnt.Create(apiContext);
            string url = createdPayment.links[1].href;
            HttpContext.Current.Response.Redirect(url);
            PaymentExecution pymntExecution = new PaymentExecution();
            pymntExecution.payer_id = ("");
            pymnt.id = createdPayment.id;
            Payment executedPayment = pymnt.Execute(apiContext, pymntExecution);
            Payment pymnt1 = new Payment();

        }
    }
}