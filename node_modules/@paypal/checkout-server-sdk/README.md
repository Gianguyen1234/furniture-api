# PayPal Checkout API SDK for NodeJS

![PayPal Developer](/homepage.jpg)

### To consolidate support across various channels, we have currently turned off the feature of GitHub issues. Please visit https://www.paypal.com/support to submit your request or ask questions within our community forum.

__Welcome to PayPal NodeJS SDK__. This repository contains PayPal's NodeJS SDK and samples for [v2/checkout/orders](https://developer.paypal.com/docs/api/orders/v2/) and [v2/payments](https://developer.paypal.com/docs/api/payments/v2/) APIs.

This is a part of the next major PayPal SDK. It includes a simplified interface to only provide simple model objects and blueprints for HTTP calls. This repo currently contains functionality for PayPal Checkout APIs which includes [Orders V2](https://developer.paypal.com/docs/api/orders/v2/) and [Payments V2](https://developer.paypal.com/docs/api/payments/v2/).

Please refer to the [PayPal Checkout Integration Guide](https://developer.paypal.com/docs/checkout/) for more information. Also refer to [Setup your SDK](https://developer.paypal.com/docs/checkout/reference/server-integration/setup-sdk/) for additional information about setting up the SDK's. 

## Usage
### Binaries

It is not mandatory to fork this repository for using the PayPal SDK. You can refer [PayPal Checkout Server SDK](https://developer.paypal.com/docs/checkout/reference/server-integration) for configuring and working with SDK without forking this code.

For contributing or referring the samples, you can fork/refer this repository. 

## Examples
### Creating an Order
#### Code to Execute:
```javascript
const paypal = require('@paypal/checkout-server-sdk');
  
// Creating an environment
let clientId = "<<PAYPAL-CLIENT-ID>>";
let clientSecret = "<<PAYPAL-CLIENT-SECRET>>";

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

// Construct a request object and set desired parameters
// Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
let request = new paypal.orders.OrdersCreateRequest();
request.requestBody({
    "intent": "CAPTURE",
    "purchase_units": [
        {
            "amount": {
                "currency_code": "USD",
                "value": "100.00"
            }
        }
     ]
});

// Call API with your client and get a response for your call
let createOrder  = async function() {
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log(`Order: ${JSON.stringify(response.result)}`);
}
createOrder();
```
#### Example Output:
```
{
    "id": "4VW45368HJ294683Y",
    "links": [
        {
            "href": "https://api.sandbox.paypal.com/v2/checkout/orders/4VW45368HJ294683Y",
            "method": "GET",
            "rel": "self"
        },
        {
            "href": "https://www.sandbox.paypal.com/checkoutnow?token=4VW45368HJ294683Y",
            "method": "GET",
            "rel": "approve"
        },
        {
            "href": "https://api.sandbox.paypal.com/v2/checkout/orders/4VW45368HJ294683Y",
            "method": "PATCH",
            "rel": "update"
        },
        {
            "href": "https://api.sandbox.paypal.com/v2/checkout/orders/4VW45368HJ294683Y/capture",
            "method": "POST",
            "rel": "capture"
        }
    ],
    "status": "CREATED"
}
```

## Capturing an Order
 Before Capturing an order, it should be approved by the buyer using approve link in the create order response.
### Code to Execute:
```javascript
let captureOrder =  async function(orderId) {
    request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    // Call API with your client and get a response for your call
    let response = await client.execute(request);
    console.log(`Response: ${JSON.stringify(response)}`);
    // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    console.log(`Capture: ${JSON.stringify(response.result)}`);
}

let capture = captureOrder('REPLACE-WITH-APPROVED-ORDER-ID'); 
```

#### Example Output:
```JSON
{
    "id": "96J43722461654618",
    "links": [
        {
            "href": "https://api.sandbox.paypal.com/v2/checkout/orders/96J43722461654618",
            "method": "GET",
            "rel": "self"
        }
    ],
    "payer": {
        "address": {
            "country_code": "US"
        },
        "email_address": "byer@example.com",
        "name": {
            "given_name": "John",
            "surname": "Doe"
        },
        "payer_id": "XXXXXXXXXXX",
        "phone": {
            "phone_number": {
                "national_number": "111-111-1111"
            }
        }
    },
    "purchase_units": [
        {
            "payments": {
                "captures": [
                    {
                        "amount": {
                            "currency_code": "USD",
                            "value": "100.00"
                        },
                        "create_time": "2019-02-05T02:44:14Z",
                        "final_capture": true,
                        "id": "7XU44982RK2157057",
                        "links": [
                            {
                                "href": "https://api.sandbox.paypal.com/v2/payments/captures/7XU44982RK2157057",
                                "method": "GET",
                                "rel": "self"
                            },
                            {
                                "href": "https://api.sandbox.paypal.com/v2/payments/captures/7XU44982RK2157057/refund",
                                "method": "POST",
                                "rel": "refund"
                            },
                            {
                                "href": "https://api.sandbox.paypal.com/v2/checkout/orders/96J43722461654618",
                                "method": "GET",
                                "rel": "up"
                            }
                        ],
                        "seller_protection": {
                            "dispute_categories": [
                                "ITEM_NOT_RECEIVED",
                                "UNAUTHORIZED_TRANSACTION"
                            ],
                            "status": "ELIGIBLE"
                        },
                        "seller_receivable_breakdown": {
                            "gross_amount": {
                                "currency_code": "USD",
                                "value": "100.00"
                            },
                            "net_amount": {
                                "currency_code": "USD",
                                "value": "96.80"
                            },
                            "paypal_fee": {
                                "currency_code": "USD",
                                "value": "3.20"
                            }
                        },
                        "status": "COMPLETED",
                        "update_time": "2019-02-05T02:44:14Z"
                    }
                ]
            },
            "reference_id": "default",
            "shipping": {
                "address": {
                    "address_line_1": "1 Main St",
                    "admin_area_1": "CA",
                    "admin_area_2": "San Jose",
                    "country_code": "US",
                    "postal_code": "95131"
                },
                "name": {
                    "full_name": "John Doe"
                }
            }
        }
    ],
    "status": "COMPLETED"
}
```

## Running tests

To run integration tests using your client id and secret, clone this repository and run the following command:
```sh
$ npm install
$ PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID PAYPAL_CLIENT_SECRET=YOUR_SANDBOX_CLIENT_SECRET npm test
```

## Samples

You can start off by trying out [creating and capturing an order](https://github.com/paypal/Checkout-NodeJS-SDK/tree/master/samples/CaptureIntentExamples/runAll.js)

To try out different samples for both create and authorize intent check [this link](https://github.com/paypal/Checkout-NodeJS-SDK/tree/master/samples)

Note: Update the `payPalClient.js` with your sandbox client credentials or pass your client credentials as environment variable while executing the samples.

## Note

PayPalHttpClient used as part of this project returns Promises

You can read more about Promises here: https://www.promisejs.org/


## License
Code released under [SDK LICENSE](LICENSE)  
