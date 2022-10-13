export const generateData = (data: any, objectData: any, dbData: any) => {
    return {
        ...objectData, 'Screen Size': data.screenSize ? data.screenSize : dbData["Screen Size"],
        'Theme': data.theme ? data.theme : dbData["Theme"],
        'Top Logo': {
            'Kiosoft Logo': data.kioSoft ? data.kioSoft : dbData["Top Logo"]["Kiosoft Logo"],
            'Vendor Logo': data.vendor ? data.vendor : dbData["Top Logo"]["Vendor Logo"]
        },
        'Title String': {
            'String': data.string ? data.string : dbData["Title String"]["String"],
        },
        'Button': [
            {
                'Button Color': data.buttonColor[0] ? data.buttonColor[0] : dbData["Button"][0]["Button Color"],
                'Button String': data.buttonString[0] ? data.buttonString[0] : dbData["Button"][0]["Button String"],
            },
            {
                'Button Color': data.buttonColor[1] ? data.buttonColor[1] : dbData["Button"][1]["Button Color"],
                'Button String': data.buttonString[1] ? data.buttonString[1] : dbData["Button"][1]["Button String"],
            }
        ],
        'Information': {
            'Machine Info': data.machineInfo ? data.machineInfo : dbData["Information"]["Machine Info"],
            'Reader Type': data.readerType ? data.readerType : dbData["Information"]["Reader Type"],
            'Network Type': data.networkType ? data.networkType : dbData["Information"]["Network Type"],
            'Network Signal': data.networkSignal ? data.networkSignal : dbData["Information"]["Network Signal"],
            'Bluetooth': data.bluetooth ? data.bluetooth : dbData["Information"]["Bluetooth"],
        },
        'Bottom Logo': {
            'amex': data.amex ? data.amex : dbData["Bottom Logo"]["amex"],
            'discover': data.discover ? data.discover : dbData["Bottom Logo"]["discover"],
            'intreac': data.intreac ? data.intreac : dbData["Bottom Logo"]["intreac"],
            'master': data.master ? data.master : dbData["Bottom Logo"]["master"],
            'visa': data.visa ? data.visa : dbData["Bottom Logo"]["visa"],
            'Apple Pay': data.applePay ? data.applePay : dbData["Bottom Logo"]["Apple Pay"],
            'Google Pay': data.googlePay ? data.googlePay : dbData["Bottom Logo"]["Google Pay"],
            'value card': data.valueCard ? data.valueCard : dbData["Bottom Logo"]["value card"],
            'tap card': data.tapCard ? data.tapCard : dbData["Bottom Logo"]["tap card"],
            'Mobile App': data.mobileApp ? data.mobileApp : dbData["Bottom Logo"]["Mobile App"],
            'coin': data.coin ? data.coin : dbData["Bottom Logo"]["coin"],
        }
    };
}