import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LANG_KEY = 'carkit_driver_lang';
const LanguageContext = createContext(null);

const getInitialLang = () => {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(LANG_KEY);
  if (saved === 'en' || saved === 'ar') return saved;
  
  // Detect system language if no saved preference
  const browserLang = navigator.language || navigator.userLanguage || 'en';
  return browserLang.startsWith('ar') ? 'ar' : 'en';
};

const translations = {
  en: {
    // Navigation
    'Dashboard': 'Dashboard',
    'Active Order': 'Active Order',
    'History': 'History',
    'Profile': 'Profile',
    'Requests': 'Requests',
    'Active Job': 'Active Job',
    'Delivery Driver': 'Delivery Driver',
    'Emergency': 'Emergency',
    'CarKit': 'CarKit',
    'Available Orders': 'Available Orders',
    'Incoming Requests': 'Incoming Requests',
    'Emergency Account': 'Emergency Account',
    'Active Emergency': 'Active Emergency',
    'Delivery History': 'Delivery History',
    
    // Auth & Generic
    'Login': 'Login',
    'Email Address': 'Email Address',
    'Password': 'Password',
    'Signing in...': 'Signing in...',
    'Sign In': 'Sign In',
    'Welcome Back': 'Welcome Back',
    'Sign in to your driver account': 'Sign in to your driver account',
    'Sign in to your emergency employee account': 'Sign in to your emergency employee account',
    'CarKit Field Ops': 'CarKit Field Ops',
    'Phone or Email': 'Phone or Email',
    'Enter your password': 'Enter your password',
    'Hide password': 'Hide password',
    'Show password': 'Show password',
    'Encrypted session': 'Encrypted session',
    'Driver verified': 'Driver verified',
    'Provider managed': 'Provider managed',
    'Create driver account': 'Create driver account',
    'Emergency employee accounts are created by service providers.': 'Emergency employee accounts are created by service providers.',
    'Login failed.': 'Login failed.',
    
    // Signup
    'Create Account': 'Create Account',
    'Get approved to start accepting deliveries.': 'Get approved to start accepting deliveries.',
    'Driver Onboarding': 'Driver Onboarding',
    '1. Info & Vehicle': '1. Info & Vehicle',
    '2. Photo Uploads': '2. Photo Uploads',
    'Personal Information': 'Personal Information',
    'Full Name': 'Full Name',
    'Phone Number': 'Phone Number',
    'Vehicle Details': 'Vehicle Details',
    'Vehicle Type': 'Vehicle Type',
    'Vehicle Plate': 'Vehicle Plate',
    'Motorcycle': 'Motorcycle',
    'Car': 'Car',
    'Van': 'Van',
    'Truck': 'Truck',
    'Security': 'Security',
    'Confirm Password': 'Confirm Password',
    'Min. 8 characters': 'Min. 8 characters',
    'Repeat password': 'Repeat password',
    'Profile Photo': 'Profile Photo',
    'Profile Picture': 'Profile Picture',
    'Clear face photo - optional but recommended': 'Clear face photo - optional but recommended',
    'National ID Verification': 'National ID Verification',
    'Front Side': 'Front Side',
    'Photo of the front of your National ID': 'Photo of the front of your National ID',
    'Back Side': 'Back Side',
    'Photo of the back of your National ID': 'Photo of the back of your National ID',
    'Your account will stay pending until an admin verifies your uploaded ID.': 'Your account will stay pending until an admin verifies your uploaded ID.',
    'Account Under Review': 'Account Under Review',
    'Your driver account has been created with pending approval status. An admin must verify your ID before you can accept deliveries.': 'Your driver account has been created with pending approval status. An admin must verify your ID before you can accept deliveries.',
    'Back to Login': 'Back to Login',
    'Full Name is required.': 'Full Name is required.',
    'Phone Number is required.': 'Phone Number is required.',
    'Email Address is required.': 'Email Address is required.',
    'Vehicle Plate is required.': 'Vehicle Plate is required.',
    'Password is required.': 'Password is required.',
    'Password must be at least 8 characters.': 'Password must be at least 8 characters.',
    'Passwords do not match.': 'Passwords do not match.',
    'Please capture or upload the front of your national ID (بطاقة – وجه أمامي).': 'Please capture or upload the front of your national ID (بطاقة – وجه أمامي).',
    'Please capture or upload the back of your national ID (بطاقة – الظهر).': 'Please capture or upload the back of your national ID (بطاقة – الظهر).',
    'Submitting...': 'Submitting...',
    'Next Step': 'Next Step',
    'Submit for Approval': 'Submit for Approval',
    'Back': 'Back',
    'Upload': 'Upload',
    'Camera': 'Camera',
    'Retake / Change': 'Retake / Change',
    'Tap to upload or use camera': 'Tap to upload or use camera',
    'Uploading...': 'Uploading...',
    
    // Buttons
    'Directions': 'Directions',
    'Upload Proof': 'Upload Proof',
    'Take Photo': 'Take Photo',
    'Mark Return Delivered': 'Mark Return Delivered',
    'Mark as Delivered': 'Mark as Delivered',
    'Accept Return': 'Accept Return',
    'Accept Order': 'Accept Order',
    'Completing...': 'Completing...',
    'No active order right now.': 'No active order right now.',
    
    // Status / Badge
    'Active Return Delivery': 'Active Return Delivery',
    'Active Delivery': 'Active Delivery',
    'Return Order #': 'Return Order #',
    'Order #': 'Order #',
    'In Transit': 'In Transit',
    'Delivered': 'Delivered',
    
    // Details
    'Pickup From (Customer)': 'Pickup From (Customer)',
    'Return To (Vendor Branch)': 'Return To (Vendor Branch)',
    'Customer Details': 'Customer Details',
    'Order Items': 'Order Items',
    'Delivery notes (optional)...': 'Delivery notes (optional)...',
    'Remove proof photo': 'Remove proof photo',
    'Proof preview': 'Proof preview',
    
    // Dashboard & Stats
    'Loading deliveries...': 'Loading deliveries...',
    'Active order #': 'Active order #',
    ' - tap to manage': ' - tap to manage',
    'items ready': 'items ready',
    'items to return': 'items to return',
    'items': 'items',
    'From:': 'From:',
    'to': 'to',
    'To:': 'To:',
    'No orders available right now. Check back soon.': 'No orders available right now. Check back soon.',
    'Earnings': 'Earnings',
    'Total Deliveries': 'Total Deliveries',
    'Today\'s Deliveries': 'Today\'s Deliveries',
    
    // History
    'total': 'total',
    'Unknown area': 'Unknown area',
    'No completed deliveries': 'No completed deliveries',
    ' for this date': ' for this date',
    'Delivery proof': 'Delivery proof',
    
    // Profile
    'Profile updated successfully!': 'Profile updated successfully!',
    'Could not save profile.': 'Could not save profile.',
    'Driver account': 'Driver account',
    'Vehicle': 'Vehicle',
    'Plate': 'Plate',
    'Edit Information': 'Edit Information',
    'Saving...': 'Saving...',
    'Save Profile': 'Save Profile',
    'Logout': 'Logout',
    
    // Emergency Operations
    'Go Offline': 'Go Offline',
    'Go Online': 'Go Online',
    'ONLINE - receiving requests': 'ONLINE - receiving requests',
    'You are OFFLINE - no requests visible': 'You are OFFLINE - no requests visible',
    'Active emergency job #': 'Active emergency job #',
    'Accept Request': 'Accept Request',
    'No requests right now. Stay online to receive them.': 'No requests right now. Stay online to receive them.',
    'Go online to start receiving emergency requests.': 'Go online to start receiving emergency requests.',
    'No active emergency job.': 'No active emergency job.',
    'accepted': 'accepted',
    'arrived': 'arrived',
    'completed': 'completed',
    'Customer pin': 'Customer pin',
    'Customer': 'Customer',
    'Phone': 'Phone',
    'Payment': 'Payment',
    'Mark as Complete': 'Mark as Complete',
    'Cancel Job': 'Cancel Job',
    'Cancellation Reason': 'Cancellation Reason',
    'Describe the reason...': 'Describe the reason...',
    'Close': 'Close',
    'Confirm Cancel': 'Confirm Cancel',
    'I\'ve Arrived': 'I\'ve Arrived',
    'High cancellation count:': 'High cancellation count:',
    'This may affect your eligibility.': 'This may affect your eligibility.',
    'All': 'All',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled',
    'Expired': 'Expired',
    'No emergency jobs found for this filter.': 'No emergency jobs found for this filter.',
    'Emergency Service': 'Emergency Service',
    'Cancellations': 'Cancellations',
    'Role': 'Role',
    'Service': 'Service',
    'Emergency employee accounts are managed by the service provider.': 'Emergency employee accounts are managed by the service provider.',
    'Vehicle breakdown': 'Vehicle breakdown',
    'Emergency of my own': 'Emergency of my own',
    'Cannot locate customer': 'Cannot locate customer',
    'Other': 'Other'
  },
  ar: {
    // Navigation
    'Dashboard': 'لوحة التحكم',
    'Active Order': 'الطلب النشط',
    'History': 'السجل',
    'Profile': 'الملف الشخصي',
    'Requests': 'الطلبات',
    'Active Job': 'العمل النشط',
    'Delivery Driver': 'سائق التوصيل',
    'Emergency': 'الطوارئ',
    'CarKit': 'كار كيت',
    'Available Orders': 'الطلبات المتاحة',
    'Incoming Requests': 'الطلبات الواردة',
    'Emergency Account': 'حساب الطوارئ',
    'Active Emergency': 'طوارئ نشطة',
    'Delivery History': 'سجل التوصيل',
    
    // Auth & Generic
    'Login': 'تسجيل الدخول',
    'Email Address': 'البريد الإلكتروني',
    'Password': 'كلمة المرور',
    'Signing in...': 'جاري تسجيل الدخول...',
    'Sign In': 'تسجيل الدخول',
    'Welcome Back': 'مرحباً بعودتك',
    'Sign in to your driver account': 'سجل الدخول إلى حساب السائق الخاص بك',
    'Sign in to your emergency employee account': 'سجل الدخول إلى حساب موظف الطوارئ الخاص بك',
    'CarKit Field Ops': 'عمليات كار كيت الميدانية',
    'Phone or Email': 'الهاتف أو البريد الإلكتروني',
    'Enter your password': 'أدخل كلمة المرور',
    'Hide password': 'إخفاء كلمة المرور',
    'Show password': 'إظهار كلمة المرور',
    'Encrypted session': 'جلسة مشفرة',
    'Driver verified': 'سائق معتمد',
    'Provider managed': 'مدار من قبل المزود',
    'Create driver account': 'إنشاء حساب سائق',
    'Emergency employee accounts are created by service providers.': 'يتم إنشاء حسابات موظفي الطوارئ من قبل مزودي الخدمة.',
    'Login failed.': 'فشل تسجيل الدخول.',
    
    // Signup
    'Create Account': 'إنشاء حساب',
    'Get approved to start accepting deliveries.': 'احصل على الموافقة لبدء قبول التوصيل.',
    'Driver Onboarding': 'تسجيل السائقين',
    '1. Info & Vehicle': '١. المعلومات والركوبة',
    '2. Photo Uploads': '٢. رفع الصور',
    'Personal Information': 'المعلومات الشخصية',
    'Full Name': 'الاسم الكامل',
    'Phone Number': 'رقم الهاتف',
    'Vehicle Details': 'تفاصيل الركوبة',
    'Vehicle Type': 'نوع الركوبة',
    'Vehicle Plate': 'لوحة الركوبة',
    'Motorcycle': 'دراجة نارية',
    'Car': 'سيارة',
    'Van': 'فان',
    'Truck': 'شاحنة',
    'Security': 'الأمان',
    'Confirm Password': 'تأكيد كلمة المرور',
    'Min. 8 characters': '٨ أحرف على الأقل',
    'Repeat password': 'كرر كلمة المرور',
    'Profile Photo': 'صورة الملف الشخصي',
    'Profile Picture': 'صورة الملف الشخصي',
    'Clear face photo - optional but recommended': 'صورة واضحة للوجه - اختيارية ولكن موصى بها',
    'National ID Verification': 'التحقق من الهوية الوطنية',
    'Front Side': 'الوجه الأمامي',
    'Photo of the front of your National ID': 'صورة للوجه الأمامي من الهوية الوطنية',
    'Back Side': 'الوجه الخلفي',
    'Photo of the back of your National ID': 'صورة للوجه الخلفي من الهوية الوطنية',
    'Your account will stay pending until an admin verifies your uploaded ID.': 'سيبقى حسابك معلقاً حتى يتحقق المسؤول من هويتك المرفوعة.',
    'Account Under Review': 'الحساب تحت المراجعة',
    'Your driver account has been created with pending approval status. An admin must verify your ID before you can accept deliveries.': 'تم إنشاء حساب السائق الخاص بك وهو بانتظار الموافقة. يجب على المسؤول التحقق من هويتك قبل أن تتمكن من قبول الطلبات.',
    'Back to Login': 'العودة لتسجيل الدخول',
    'Full Name is required.': 'الاسم الكامل مطلوب.',
    'Phone Number is required.': 'رقم الهاتف مطلوب.',
    'Email Address is required.': 'البريد الإلكتروني مطلوب.',
    'Vehicle Plate is required.': 'لوحة الركوبة مطلوبة.',
    'Password is required.': 'كلمة المرور مطلوبة.',
    'Password must be at least 8 characters.': 'يجب أن تكون كلمة المرور ٨ أحرف على الأقل.',
    'Passwords do not match.': 'كلمتا المرور غير متطابقتين.',
    'Please capture or upload the front of your national ID (بطاقة – وجه أمامي).': 'يرجى التقاط صورة أو رفع الوجه الأمامي من هويتك الوطنية.',
    'Please capture or upload the back of your national ID (بطاقة – الظهر).': 'يرجى التقاط صورة أو رفع الوجه الخلفي من هويتك الوطنية.',
    'Submitting...': 'جاري الإرسال...',
    'Next Step': 'الخطوة التالية',
    'Submit for Approval': 'إرسال للموافقة',
    'Back': 'رجوع',
    'Upload': 'رفع',
    'Camera': 'الكاميرا',
    'Retake / Change': 'إعادة التقاط / تغيير',
    'Tap to upload or use camera': 'اضغط للرفع أو استخدام الكاميرا',
    'Uploading...': 'جاري الرفع...',
    
    // Buttons
    'Directions': 'الاتجاهات',
    'Upload Proof': 'رفع إثبات',
    'Take Photo': 'التقاط صورة',
    'Mark Return Delivered': 'تأكيد تسليم المرتجع',
    'Mark as Delivered': 'تأكيد التسليم',
    'Accept Return': 'قبول المرتجع',
    'Accept Order': 'قبول الطلب',
    'Completing...': 'جاري الإكمال...',
    'No active order right now.': 'لا يوجد طلب نشط حالياً.',
    
    // Status / Badge
    'Active Return Delivery': 'توصيل مرتجع نشط',
    'Active Delivery': 'توصيل نشط',
    'Return Order #': 'مرتجع طلب #',
    'Order #': 'طلب #',
    'In Transit': 'في الطريق',
    'Delivered': 'تم التوصيل',
    
    // Details
    'Pickup From (Customer)': 'الاستلام من (العميل)',
    'Return To (Vendor Branch)': 'المرتجع إلى (فرع المورد)',
    'Customer Details': 'تفاصيل العميل',
    'Order Items': 'عناصر الطلب',
    'Delivery notes (optional)...': 'ملاحظات التسليم (اختياري)...',
    'Remove proof photo': 'حذف صورة الإثبات',
    'Proof preview': 'معاينة الإثبات',
    
    // Dashboard & Stats
    'Loading deliveries...': 'جاري تحميل التوصيلات...',
    'Active order #': 'الطلب النشط #',
    ' - tap to manage': ' - اضغط للإدارة',
    'items ready': 'عناصر جاهزة',
    'items to return': 'عناصر للمرتجع',
    'items': 'عناصر',
    'From:': 'من:',
    'to': 'إلى',
    'To:': 'إلى:',
    'No orders available right now. Check back soon.': 'لا توجد طلبات متاحة حالياً. تفقد مجدداً قريباً.',
    'Earnings': 'الأرباح',
    'Total Deliveries': 'إجمالي التوصيلات',
    'Today\'s Deliveries': 'توصيلات اليوم',
    
    // History
    'total': 'الإجمالي',
    'Unknown area': 'منطقة غير معروفة',
    'No completed deliveries': 'لا توجد توصيلات مكتملة',
    ' for this date': ' في هذا التاريخ',
    'Delivery proof': 'إثبات التوصيل',
    
    // Profile
    'Profile updated successfully!': 'تم تحديث الملف الشخصي بنجاح!',
    'Could not save profile.': 'تعذر حفظ الملف الشخصي.',
    'Driver account': 'حساب السائق',
    'Vehicle': 'المركبة',
    'Plate': 'اللوحة',
    'Edit Information': 'تعديل المعلومات',
    'Saving...': 'جاري الحفظ...',
    'Save Profile': 'حفظ الملف الشخصي',
    'Logout': 'تسجيل الخروج',
    
    // Emergency Operations
    'Go Offline': 'الذهاب لوضع عدم الاتصال',
    'Go Online': 'الذهاب لوضع الاتصال',
    'ONLINE - receiving requests': 'نشط - استقبال الطلبات',
    'You are OFFLINE - no requests visible': 'غير متصل - لن تظهر لك أي طلبات',
    'Active emergency job #': 'عمل طوارئ نشط #',
    'Accept Request': 'قبول الطلب',
    'No requests right now. Stay online to receive them.': 'لا توجد طلبات حالياً. ابق متصلاً لاستقبالها.',
    'Go online to start receiving emergency requests.': 'اتصل بالإنترنت لبدء استقبال طلبات الطوارئ.',
    'No active emergency job.': 'لا يوجد عمل طوارئ نشط.',
    'accepted': 'مقبول',
    'arrived': 'وصل',
    'completed': 'مكتمل',
    'Customer pin': 'موقع العميل',
    'Customer': 'العميل',
    'Phone': 'الهاتف',
    'Payment': 'الدفع',
    'Mark as Complete': 'تحديد كمكتمل',
    'Cancel Job': 'إلغاء العمل',
    'Cancellation Reason': 'سبب الإلغاء',
    'Describe the reason...': 'صف السبب...',
    'Close': 'إغلاق',
    'Confirm Cancel': 'تأكيد الإلغاء',
    'I\'ve Arrived': 'لقد وصلت',
    'High cancellation count:': 'عدد إلغاءات مرتفع:',
    'This may affect your eligibility.': 'قد يؤثر هذا على أهليتك.',
    'All': 'الكل',
    'Completed': 'مكتمل',
    'Cancelled': 'ملغى',
    'Expired': 'منتهي',
    'No emergency jobs found for this filter.': 'لم يتم العثور على أعمال طوارئ لهذا التصفية.',
    'Emergency Service': 'خدمة طوارئ',
    'Cancellations': 'الإلغاءات',
    'Role': 'الدور',
    'Service': 'الخدمة',
    'Emergency employee accounts are managed by the service provider.': 'يتم إدارة حسابات موظفي الطوارئ من قبل مزود الخدمة.',
    'Vehicle breakdown': 'عطل في المركبة',
    'Emergency of my own': 'حالة طوارئ شخصية',
    'Cannot locate customer': 'تعذر تحديد موقع العميل',
    'Other': 'آخر'
  }
};

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    window.localStorage.setItem(LANG_KEY, locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      t: (key) => {
        return translations[locale]?.[key] || key;
      },
      toggleLanguage() {
        setLocale((l) => (l === 'en' ? 'ar' : 'en'));
      },
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
