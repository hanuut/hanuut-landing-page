export const SatimConfirmationErrorCodes = {
  0: {
    code: "0",
    description: {
      ar: "تم استلام الطلب التأكيد بنجاح..",
      en: "Confirmation successful. Order received successfully.",
      fr: "Confirmation réussie. Commande reçue avec succès.",
    },
  },
  1: {
    code: "1",
    description: {
      ar: "معرف الطلب فارغ. يرجى إدخال معرف صحيح.",
      en: "Empty order id. Please enter a valid order id.",
      fr: "Identifiant de commande vide. Veuillez saisir un identifiant de commande valide.",
    },
  },
  2: {
    code: "2",
    description: {
      ar: "تم التأكيد بالفعل. تم تأكيد الطلب من قبل.",
      en: "Already confirmed. The order has already been confirmed.",
      fr: "Déjà confirmé. La commande a déjà été confirmée.",
    },
  },
  3: {
    code: "3",
    description: {
      ar: "تم الرفض بسبب الوصول. ليس لديك الصلاحية للوصول إلى هذا الطلب.",
      en: "Access denied. You do not have permission to access this order.",
      fr: "Accès refusé. Vous n'avez pas l'autorisation d'accéder à cette commande.",
    },
  },
  6: {
    code: "6",
    description: {
      ar: "الطلب غير معروف أو غير صحيح. يرجى التحقق من صحة معرف الطلب.",
      en: "Unknown or invalid order. Please check the order id for accuracy.",
      fr: "Commande inconnue ou invalide. Veuillez vérifier l'identifiant de commande.",
    },
  },
  7: {
    code: "7",
    description: {
      ar: "خطأ في النظام. يرجى المحاولة مرة أخرى في وقت لاحق.",
      en: "System error. Please try again later.",
      fr: "Erreur système. Veuillez réessayer ultérieurement.",
    },
  },
};
