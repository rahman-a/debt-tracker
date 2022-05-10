export const messages = {
  payLate(report, type, user) {
    if (type === 'admin') {
      return {
        en: `member ${user.englishName} with code #${user.code}# has passed the Due Date of operation number #${report}# without payment`,
        ar: `العضو ${user.arabicName} بكود رقم #${user.code}# تجاوز تاريخ الاستحقاق لعملية رقم #${report}# بدون دقع`,
      }
    }

    return {
      en: `Due Date Passed, Please Complete Your Payment for payment operation number #${report}#, 
            you have one week before your badge turn into red`,
      ar: `قد تجاوزت تاريخ الاستحقاق لعميلة الدفع رقم #${report}# من فضلك اكمل عملية الدفع أمامك اسبوع من الآن 
            قبل ان تتحول شارة الحساب الى اللون الأحمر`,
    }
  },

  payExpired(report, type, user) {
    if (type === 'admin') {
      return {
        en: `${user.englishName} with code #${user.code}#, his account badge has turned into red`,
        ar: `شارة حساب العضو ${user.arabicName} بكود رقم #${user.code}# قد تحولت اللى اللون الاحمر لمرور اسبوع على تاريخ الاستحقاق لعملية بكود #${report}# ولم يتم الدفع`,
      }
    }

    return {
      en: `You account badge has turned into red because one week passed from the due date of 
            payment operation number #${report}# and you didn't complete you payment`,
      ar: `لقد تحولت شارة حسابك الى اللون الاحمر, قد مر اسبوع على تاريخ الاستحقاق لعملية الدفع رقم #${report}# ولم تتم عملية الدفع`,
    }
  },

  doneLatePayment(report, type, user) {
    if (type === 'admin') {
      return {
        en: `${user.englishName} with code #${user.code}# has complete the payment process of operation #${report}#`,
        ar: `العضو ${user.arabicName} بكود رقم #${user.code}# قد أكمل عملية الدفع لعملية رقم #${report}#`,
      }
    }

    return {
      en: `Confirmation of payment process number #${report}#, if your state has no other issues, 
                the badge will change to green`,
      ar: `تاكيد عملية الدفع رقم #${report}#, وفى حالة عدم وجود اى مشاكل آخرى ستتحول الشارة الى اللون الأخضر`,
    }
  },

  doneExpiredPayment(report, type, user) {
    if (type === 'admin') {
      return {
        en: `${user.englishName} with code #${user.code}# has complete the payment process of operation #${report}#`,
        ar: `العضو ${user.arabicName} بكود رقم #${user.code}# قد أكمل عملية الدفع لعملية رقم #${report}#`,
      }
    }

    return {
      en: `Confirmation of payment process number #${report}#, your account badge has turned into yellow and it will turned into
            green after one month of payment date`,
      ar: `تاكيد عملية الدفع للتقرير #${report}#, شارة حسابك تحولت الى اللون الأصفر وستتحول الى اللون الأخضر بعد شهر من تاريخ الدفع`,
    }
  },

  clear(report, type, user) {
    if (type === 'admin') {
      return {
        en: `month restriction of account ${user.englishName} with code #${user.code}# has over since last payment of operation #${report}#`,
        ar: `انتهت فترة الشهر لحساب ${user.arabicName} بكود رقم #${user.code}# منذ آخر عملية الدفع لعملية رقم #${report}#`,
      }
    }

    return {
      en: `A month has over since last payment date of operation #${report}# and if there's no other issues, the badge will turn into green`,
      ar: `لقد مر شهر منذ آخر عملية دفع لعملية رقم #${report}#, وفى حالة عدم وجود مشاكل آخرى سيتم تحويل شارة الحساب الى اللون الأخضر`,
    }
  },

  idExpired(type, user) {
    if (type === 'admin') {
      return {
        en: `identity of ${user.englishName} with code #${user.code}# has expired`,
        ar: `انتهت صلاحية بطاقة الهوية للعضو ${user.arabicName} بكود رقم ${user.code}`,
      }
    }

    return {
      en: `Identity Document has expired, please upload new identity with a new expiry date`,
      ar: `لقد انتهت تاريخ صلاحية بطاقة الهوية من فضل ارفع بطاقة الهوية الجديد بتاريخ صلاحية جديد`,
    }
  },

  passExpired(type, user) {
    if (type === 'admin') {
      return {
        en: `Passport Document of ${user.englishName} with code #${user.code}# has expired`,
        ar: `انتهت صلاحية جواز السفر للعضو ${user.arabicName} بكود رقم #${user.code}#`,
      }
    }

    return {
      en: `Passport Document has expired, please upload new Passport with a new expiry date`,
      ar: `لقد انتهت تاريخ صلاحية جواز السفر من فضلك ارفع جواز السفر الجديد بتاريخ صلاحية جديد`,
    }
  },

  resiExpired(type, user) {
    if (type === 'admin') {
      return {
        en: `Residential Document of ${user.englishName} with code #${user.code}# has expired`,
        ar: `انتهت صلاحية جواز السفر للعضو ${user.arabicName} بكود رقم #${user.code}#`,
      }
    }

    return {
      en: `Residential Document has expired, please upload new ٌResidential with a new expiry date`,
      ar: `لقد انتهت تاريخ صلاحية مستند الاقامة من فضلك ارفع مستند الأقامة الجديد بتاريخ صلاحية جديد`,
    }
  },

  idUpload(type, user) {
    if (type === 'admin') {
      return {
        en: `reminder message has been sent to account ${user.englishName} with code #${user.code}# to upload identity card`,
        ar: `تم ارسال رسالة تذكير للعضو ${user.arabicName} بكود رقم #${user.code}# لرفع بطاقة الهوية`,
      }
    }
    return {
      en: `this is reminder message to remind you to upload your identity card`,
      ar: 'هذة رسالة لتذكيرك برفع بطاقة الهوية الخاص بك ',
    }
  },

  passUpload(type, user) {
    if (type === 'admin') {
      return {
        en: `reminder message has been sent to account ${user.englishName} with code #${user.code}# to upload passport document`,
        ar: `تم ارسال رسالة تذكير للعضو ${user.arabicName} بكود رقم #${user.code}# لرفع جواز السفر`,
      }
    }

    return {
      en: `this is reminder message to remind you to upload your passport document`,
      ar: 'هذة رسالة لتذكيرك برفع جواز السفر الخاص بك ',
    }
  },

  resiUpload(type, user) {
    if (type === 'admin') {
      return {
        en: `reminder message has been sent to account ${user.englishName} with code #${user.code}# to upload residential document`,
        ar: `تم ارسال رسالة تذكير للعضو ${user.arabicName} بكود رقم #${user.code}# لرفع بطاقة الاقامة`,
      }
    }

    return {
      en: `this is reminder message to remind you to upload your residential document`,
      ar: 'هذة رسالة لتذكيرك برفع بطاقة الاقامة الخاص بك',
    }
  },
}
