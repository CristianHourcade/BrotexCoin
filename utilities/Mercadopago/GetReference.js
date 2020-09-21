const Asses_TOKEN = "TEST-8463074774154489-092100-67953849d1efb6f68b38d9da4ab00e28-242652951"

export function GetUrlToPay(){
    return new Promise(resolve => {
        // console.log("https://api.mercadopago.com/checkout/preferences?access_token="+Asses_TOKEN)
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
           
            if (this.readyState == 4) {
                console.log(this.readyState);
                var x = null;
                try {
                    x = JSON.parse(this.responseText).init_point
                } catch (error) {
                    
                }
                resolve(x);
            }
        };
        xhttp.open("POST", 'https://api.mercadopago.com/checkout/preferences?access_token='+Asses_TOKEN, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({items:[{title:"John Rambo", description:"2pm",quantity:1,currency_id:'ARS',unit_price:102}]}));
    });
}