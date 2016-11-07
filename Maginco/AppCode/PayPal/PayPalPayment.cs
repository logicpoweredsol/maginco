using PayPal.Api;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Maginco.AppCode.PayPal
{
    public class PayPalPayment
    {

        public static Payment CreatePayment(string baseUrl, string intent)
        {
            Dictionary<string, string> sdkConfig = new Dictionary<string, string>();
            sdkConfig.Add("mode", "sandbox");
            string accessToken = new OAuthTokenCredential(ConfigurationManager.AppSettings["PayPalAppId"], ConfigurationManager.AppSettings["PayPalAppSecret"], sdkConfig).GetAccessToken();
            APIContext apiContext = new APIContext(accessToken);
            apiContext.Config = sdkConfig;

            var payment = new Payment()
            {
                intent = intent, 
                payer = new Payer() { payment_method = "paypal" },
                transactions = GetTransactionsList(),
                redirect_urls = GetReturnUrls(baseUrl, intent)
            };

            var createdPayment = payment.Create(apiContext);

            return createdPayment;
        }

        private static List<Transaction> GetTransactionsList()
        {

            var transactionList = new List<Transaction>();

            transactionList.Add(new Transaction()
            {
                description = "You are Upgrading from FREEMIUM to PREMIUM Account for price $100.00",
               //invoice_number = GetRandomInvoiceNumber(),
                amount = new Amount()
                {
                    currency = "USD",
                    total = "100.00",       
                    details = new Details()
                    {
                        tax = "15",
                        shipping = "10",
                        subtotal = "75"
                    }
                },
                item_list = new ItemList()
                {
                    items = new List<Item>()
            {
                new Item()
                {
                    name = "Account Upgrading To PREMIUM",
                    currency = "USD",
                    price = "75",
                    quantity = "1",
                    sku = "PREMIUM"
                }
            }
                }
            });
            return transactionList;
        }

        private static RedirectUrls GetReturnUrls(string baseUrl, string intent)
        {
            var returnUrl = intent == "sale" ? "/User/PaymentSuccessful" : "/User/AuthorizeSuccessful";

            return new RedirectUrls()
            {
                cancel_url = baseUrl + "/User/PaymentCancelled",
                return_url = baseUrl + returnUrl
            };
        }

        public static Payment ExecutePayment(string paymentId, string payerId)
        {
            Dictionary<string, string> sdkConfig = new Dictionary<string, string>();
            sdkConfig.Add("mode", "sandbox");
            string accessToken = new OAuthTokenCredential(ConfigurationManager.AppSettings["PayPalAppId"], ConfigurationManager.AppSettings["PayPalAppSecret"], sdkConfig).GetAccessToken();
            APIContext apiContext = new APIContext(accessToken);
            apiContext.Config = sdkConfig;

            var paymentExecution = new PaymentExecution() { payer_id = payerId };
            var payment = new Payment() { id = paymentId };

            var executedPayment = payment.Execute(apiContext, paymentExecution);

            return executedPayment;
        }
    }
}