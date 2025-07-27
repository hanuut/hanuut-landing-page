import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  margin: 0 auto;
  width: 75%;
  font-size: ${(props) => props.theme.fontlg};
  line-height: 1.5;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 85%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;
const Heading = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  font-weight: bold;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const SubHeading = styled.h2`
  font-size: ${(props) => props.theme.fontlg};
  font-weight: bold;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const Paragraph = styled.p`
  font-size: ${(props) => props.theme.fontmd};
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }

`;
const Link = styled.a`
  color: #0077cc;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const List = styled.ul`
  margin-bottom: 10px;
`;

const ListItem = styled.li`
  margin-left: 20px;
`;
const PrivacyPolicy = () => {
  const { i18n } = useTranslation();
  return i18n.language === "ar" ? (
    <Container isArabic={true}>
      <Heading>سياسة الخصوصية</Heading>
      <Paragraph>
        بنى Hanuut Express تطبيق Hanuut كتطبيق مجاني. يتم توفير هذه الخدمة من
        قبل Hanuut Express بدون تكلفة ومقصودة للاستخدام كما هي.
      </Paragraph>
      <SubHeading>جمع واستخدام المعلومات</SubHeading>
      <Paragraph>
        يتم استخدام هذه الصفحة لإبلاغ الزوار بسياساتنا فيما يتعلق بجمع واستخدام
        والكشف عن المعلومات الشخصية إذا قرر أي شخص استخدام خدمتنا.
      </Paragraph>
      <Paragraph>
        إذا قررت استخدام خدمتنا ، فإنك توافق على جمع واستخدام المعلومات فيما
        يتعلق بهذه السياسة. تستخدم المعلومات الشخصية التي نجمعها لتقديم الخدمة
        وتحسينها. لن نستخدم أو نشارك معلوماتك مع أي شخص إلا كما هو موضح في هذه
        السياسة.
      </Paragraph>
      <Paragraph>
        تحتوي المصطلحات المستخدمة في هذه السياسة على نفس المعاني المستخدمة في
        شروطنا وأحكامنا ، التي يمكن الوصول إليها في Hanuut ما لم يتم تعريفها
        خلاف ذلك في هذه السياسة الخاصة بالخصوصية.
      </Paragraph>
      <SubHeading>جمع واستخدام المعلومات</SubHeading>
      <Paragraph>
        من أجل تجربة أفضل أثناء استخدام خدمتنا ، قد نطلب منك تقديم بعض المعلومات
        الشخصية المحددة. ستبقى المعلومات التي نطلبها معنا وستستخدم كما هو موضح
        في سياسة الخصوصية هذه.
      </Paragraph>
      <Paragraph>
        يستخدم التطبيق خدمات الطرف الثالث التي قد تجمع المعلومات المستخدمة
        لتحديد هويتك.
      </Paragraph>
      <List>
        <ListItem>خدمات Google Play</ListItem>
      </List>
      <SubHeading>بيانات السجل</SubHeading>
      <Paragraph>
        نود إعلامك بأنه في كل مرة تستخدم فيها خدمتنا ، في حالة حدوث خطأ في
        التطبيق ، نجمع البيانات والمعلومات (عبر منتجات الطرف الثالث) على هاتفك
        المسمى بيانات السجل. يمكن أن تتضمن بيانات السجل هذه المعلومات مثل عنوان
        بروتوكول الإنترنت ("IP") الخاصة بجهازك واسم الجهاز وإصدار نظام التشغيل
        وتكوين التطبيق عند استخدام خدمتنا ووقت وتاريخ استخدامك للخدمة وإحصائيات
        أخرى.
      </Paragraph>
      <SubHeading>ملفات تعريف الارتباط (كوكيز)</SubHeading>
      <Paragraph>
        ملفات تعريف الارتباط هي ملفات تحتوي على كمية صغيرة من البيانات التي يتم
        استخدامها عادة كمعرف فريد مجهول. يتم إرسال هذه الملفات إلى متصفحك من
        المواقع التي تزورها ويتم تخزينها على ذاكرة جهازك الداخلية.
      </Paragraph>
      <Paragraph>
        لا يستخدم هذاالتطبيق "ملفات تعريف الارتباط" بشكل صريح. ومع ذلك ، قد
        يستخدم التطبيق رمزًا ومكتبات من الطرف الثالث التي تستخدم "ملفات تعريف
        الارتباط" لجمع المعلومات وتحسين خدماتها. لديك الخيار إما قبول أو رفض هذه
        الملفات والتعرف عندما يتم إرسال ملف تعريف الارتباط إلى جهازك. إذا قررت
        رفض ملفات تعريف الارتباط ، فقد لا تتمكن من استخدام بعض أجزاء هذه الخدمة.
      </Paragraph>
      <SubHeading>مزودي الخدمة</SubHeading>
      <Paragraph>
        قد نستخدم شركات وأفرادًا من الطرف الثالث لأسباب معينة ، وذلك للقيام
        بالأمور التالية:
      </Paragraph>
      <List>
        <ListItem>لتسهيل خدمتنا؛</ListItem>
        <ListItem>لتقديم الخدمة نيابة عنا؛</ListItem>
        <ListItem>لتنفيذ خدمات متعلقة بالخدمة؛ أو</ListItem>
        <ListItem>لمساعدتنا في تحليل كيفية استخدام خدمتنا.</ListItem>
      </List>
      <Paragraph>
        نريد إعلام مستخدمي هذه الخدمة بأن هذه الأطراف الثالثة لديها الوصول إلى
        معلوماتهم الشخصية. السبب هو تنفيذ المهام المحددة الموكلة إليهم نيابة
        عنا. ومع ذلك ، يتعين عليهم عدم الكشف عن المعلومات أو استخدامها لمعلومات
        لأي غرض آخر.
      </Paragraph>
      <SubHeading>الأمان</SubHeading>
      <Paragraph>
        نحن نقدر ثقتك في تزويدنا بمعلوماتك الشخصية ، وبالتالي نحن نسعى جاهدين
        لاستخدام وسائل حماية تجارية مقبولة لحمايتها. ولكن تذكر أنه لا يوجد طريقة
        لنقل البيانات عبر الإنترنت أو طريقة لتخزينها إلكترونيًا تكون مئة في
        المئة آمنة وموثوقة ، ولا يمكننا ضمان أمانها المطلق.
      </Paragraph>
      <SubHeading>روابط لمواقع أخرى</SubHeading>
      <Paragraph>
        يمكن أن تحتوي خدمتنا على روابط إلى مواقع أخرى لا تخضع لسياسة الخصوصية
        هذه. إذا قمت بالنقر على رابط من موقع الويب الخارجي ، فسوف تتم إعادتك إلى
        موقع الويب الخارجي. نحن لسنا مسؤولين عن ممارسات الخصوصية لمواقع الويب
        الخارجية وتشجعك على قراءة بيانات الخصوصية لأي موقع تزوره.
      </Paragraph>
      <SubHeading>الخصوصية للأطفال</SubHeading>
      <Paragraph>
        لا يتم توجيه خدماتنا إلى أي شخص يقل عمره عن 13 عامًا. نحن لا نجمع
        بشكلمتعمد معلومات شخصية من الأطفال دون سن 13 عامًا. إذا كنت تعتقد أننا
        جمعنا معلومات شخصية من طفل دون سن 13 عامًا ، فيرجى الاتصال بنا على الفور
        وسنقوم بحذف هذه المعلومات.
      </Paragraph>
      <SubHeading>تغييرات في سياسة الخصوصية الخاصة بنا</SubHeading>
      <Paragraph>
        نحن نحتفظ بحق تحديث أو تغيير سياسة الخصوصية الخاصة بنا من وقت لآخر.
        سنقوم بإشعار المستخدمين بأي تغييرات جوهرية عن طريق نشر سياسة الخصوصية
        الجديدة على هذه الصفحة. يرجى مراجعة هذه الصفحة بشكل دوري للاطلاع على أي
        تغييرات. يستمر استخدامك لخدماتنا بعد نشر أي تغيير يعني موافقتك على هذه
        التغييرات.
      </Paragraph>
      <SubHeading>اتصل بنا</SubHeading>
      <Paragraph>
        إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية الخاصة بنا ، فيرجى
        الاتصال بنا عبر البريد الإلكتروني التالي:  <Link href="mailto:contact@hanuut.com"> contact@hanuut.com</Link>
      </Paragraph>
    </Container>
  ) : (
    <Container>
      <Heading>Privacy Policy</Heading>
      <Paragraph>
        Hanuut Express built the Hanuut app as a Free app. This SERVICE is
        provided by Hanuut Express at no cost and is intended for use as is.
      </Paragraph>
      <SubHeading>Information Collection and Use</SubHeading>
      <Paragraph>
        This page is used to inform visitors regarding our policies with the
        collection, use, and disclosure of Personal Information if anyone
        decided to use our Service.
      </Paragraph>
      <Paragraph>
        If you choose to use our Service, then you agree to the collection and
        use of information in relation to this policy. The Personal Information
        that we collect is used for providing and improving the Service. We will
        not use or share your information with anyone except as described in
        this Privacy Policy.
      </Paragraph>
      <Paragraph>
        The terms used in this Privacy Policy have the same meanings as in our
        Terms and Conditions, which are accessible at Hanuut unless otherwise
        defined in this Privacy Policy.
      </Paragraph>
      <SubHeading>Information Collection and Use</SubHeading>
      <Paragraph>
        For a better experience, while using our Service, we may require you to
        provide us with certain personallyidentifiable information. The
        information that we request will be retained by us and used as described
        in this privacy policy.
      </Paragraph>
      <Paragraph>
        The app does use third-party services that may collect information used
        to identify you.
      </Paragraph>
      <List>
        <ListItem>Google Play Services</ListItem>
      </List>
      <SubHeading>Log Data</SubHeading>
      <Paragraph>
        We want to inform you that whenever you use our Service, in a case of an
        error in the app we collect data and information (through third-party
        products) on your phone called Log Data. This Log Data may include
        information such as your device Internet Protocol (“IP”) address, device
        name, operating system version, the configuration of the app when
        utilizing our Service, the time and date of your use of the Service, and
        other statistics.
      </Paragraph>
      <SubHeading>Cookies</SubHeading>
      <Paragraph>
        Cookies are files with a small amount of data that are commonly used as
        anonymous unique identifiers. These are sent to your browser from the
        websites that you visit and are stored on your device's internal memory.
      </Paragraph>
      <Paragraph>
        This Service does not use these “cookies” explicitly. However, the app
        may use third-party code and libraries that use “cookies” to collect
        information and improve their services. You have the option to either
        accept or refuse these cookies and know when a cookie is being sent to
        your device.If you choose to refuse our cookies, you may not be able to
        use some portions of this Service.
      </Paragraph>
      <SubHeading>Service Providers</SubHeading>
      <Paragraph>
        We may employ third-party companies and individuals due to the following
        reasons:
      </Paragraph>
      <List>
        <ListItem>To facilitate our Service;</ListItem>
        <ListItem>To provide the Service on our behalf;</ListItem>
        <ListItem>To perform Service-related services; or</ListItem>
        <ListItem>To assist us in analyzing how our Service is used.</ListItem>
      </List>
      <Paragraph>
        We want to inform users of this Service that these third parties have
        access to their Personal Information. The reason is to perform the tasks
        assigned to them on our behalf. However, they are obligated not to
        disclose or use the information for any other purpose.
      </Paragraph>
      <SubHeading>Security</SubHeading>
      <Paragraph>
        We value your trust in providing us your Personal Information, thus we
        are striving to use commercially acceptable means of protecting it. But
        remember that no method of transmission over the internet, or method of
        electronic storage is 100% secure and reliable, and we cannot guarantee
        its absolute security.
      </Paragraph>
      <SubHeading>Links to Other Sites</SubHeading>
      <Paragraph>
        This Service may contain links to other sites. If you click on a
        third-party link, you will be directed to that site. Note that
        theseexternal sites are not operated by us. Therefore, we strongly
        advise you to review the Privacy Policy of these websites. We have no
        control over and assume no responsibility for the content, privacy
        policies, or practices of any third-party sites or services.
      </Paragraph>
      <SubHeading>Children’s Privacy</SubHeading>
      <Paragraph>
        These Services do not address anyone under the age of 13. We do not
        knowingly collect personally identifiable information from children
        under 13 years of age. In the case we discover that a child under 13 has
        provided us with personal information, we immediately delete this from
        our servers. If you are a parent or guardian and you are aware that your
        child has provided us with personal information, please contact us so
        that we will be able to do the necessary actions.
      </Paragraph>
      <SubHeading>Changes to This Privacy Policy</SubHeading>
      <Paragraph>
        We may update our Privacy Policy from time to time. Thus, you are
        advised to review this page periodically for any changes. We will notify
        you of any changes by posting the new Privacy Policy on this page.
      </Paragraph>
      <Paragraph>This policy is effective as of 05-19-2025</Paragraph>
      <SubHeading>Contact Us</SubHeading>
      <Paragraph>
        If you have any questions or suggestions about our Privacy Policy, do
        not hesitate to contact us at contact@hanuut.com.
      </Paragraph>
    </Container>
  );
};

export default PrivacyPolicy;
