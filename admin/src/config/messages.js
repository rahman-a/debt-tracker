const messages = {
    payLate(report){
       return {
        en:`Due Date Passed, Please Complete Your Payment for payment operation number #{{${report}}}, 
        you have one week before your badge turn into red`,
        ar:`قد تجاوزت تاريخ الاستحقاق لعميلة الدفع رقم #{{${report}}} من فضلك اكمل عملية الدفع أمامك اسبوع من الآن 
        قبل ان تتحول شارة الحساب الى اللون الأحمر`
       }
    },
    payExpired(report){
        return {
            en:`You account badge has turned into red because one week passed from the due date of 
            payment operation number #{{${report}}} and you didn't complete you payment`,
            ar:`لقد تحولت شارة الحساب الى اللون الاحمر, قد مر اسبوع على تاريخ الاستحقاق لعملية الدفع رقم #{{${report}}} ولم تتم عملية الدفع`
        }
    },
    doneLatePayment(report){
       return {
            en:`Confirmation of payment process number #{{${report}}}, if your state has no other issues, 
                the badge will change to green`,
            ar:`تاكيد عملية الدفع رقم #{{${report}}}, وفى حالة عدم وجود اى مشاكل آخرى ستتحول الشارة الى اللون الأخضر`
        }
    },
    doneExpiredPayment(report){
        return {
            en:`Confirmation of payment process number #{{${report}}}, your account badge has turned into yellow and it will turned into
            green after one month of payment date`,
            ar:`تاكيد عملية الدفع رقم #{{${report}}}, شارة الحساب تحولت الى اللون الأصفر وستتحول الى اللون الخضر بعد شهر من تاريخ الدفع`
        }
    },
    clear(report){
        return {
            en:`A month has over since last payment date of operation #{{${report}}} and if there's no other issues, the badge will turn into green`,
            ar:`لقد مر شهر منذ آخر عملية دفع لعملية رقم #{{${report}}}, وفى حالة عدم وجود مشاكل آخرى سيتم تحويل شارة الحساب الى اللون الأخضر`
        }
    },
    idExpired:{
        en:`Identity Document has expired, please upload new identity with a new expiry date`,
        ar:`لقد انتهت تاريخ صلاحية بطاقة الهوية من فضل ارفع بطاقة الهوية الجديدة بتاريخ صلاجية جديد`
    },
    passExpired:{
        en:`Passport Document has expired, please upload new Passport with a new expiry date`,
        ar:`لقد انتهت تاريخ صلاحية جواز السفر من فضل ارفع جواز السفر الجديدة بتاريخ صلاجية جديد`
    },
    resiExpired:{
        en:`Residential Document has expired, please upload new ٌResidential with a new expiry date`,
        ar:`لقد انتهت تاريخ صلاحية مستند الاقامة من فضل ارفع مستند الأقامة الجديدة بتاريخ صلاجية جديد`
    },
    idUpload:{
        en:`this is reminder message to remind you to upload your identity card`,
        ar:'هذة رسالة لتذكيرك برفع بطاقة الهوية الخاص بك '
    },
    resiUpload:{
        en:`this is reminder message to remind you to upload your passport document`,
        ar:'هذة رسالة لتذكيرك برفع جواز السفر الخاص بك '
    }
}

export default messages