import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  margin: 0 auto;
  width: 75%;
  font-size: ${(props) => props.theme.fontlg};
  line-height: 1.5;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;
const Heading = styled.h1`
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: bold;
  margin-bottom: 10px;
`;

const SubHeading = styled.h2`
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: bold;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  font-size: ${(props) => props.theme.font};
  margin-bottom: 10px;
`;

const List = styled.ul`
  margin-bottom: 10px;
`;

const ListItem = styled.li`
  margin-left: 20px;
`;

const Link = styled.a`
  color: #0077cc;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
const TermsAndConditions = () => {
  const { i18n } = useTranslation();
  return i18n.language === "ar" ? (
    <Container isArabic={true}>
      <Heading>الشروط والأحكام</Heading>
      <SubHeading>1. المقدمة</SubHeading>
      <Paragraph>
        بتحميل أو استخدام التطبيق، سيتم تطبيق هذه الشروط تلقائيا عليك - يجب عليك
        بالتالي التأكد من قراءتها بعناية قبل استخدام التطبيق.
      </Paragraph>
      <SubHeading>2. القيود</SubHeading>
      <Paragraph>
        لا يسمح لك بنسخ أو تعديل التطبيق، أو أي جزء من التطبيق، أو علاماتنا
        التجارية بأي شكل من الأشكال. ولا يسمح لك بمحاولة استخراج الشفرة المصدرية
        للتطبيق، وأيضًا لا ينبغي لك محاولة ترجمة التطبيق إلى لغات أخرى أو
        إنشاءنسخ مشتقة. ينتمي التطبيق نفسه، وجميع العلامات التجارية وحقوق النشر
        وحقوق قواعد البيانات وحقوق الملكية الفكرية الأخرى المتعلقة به، لشركة
        Hanuut Express.
      </Paragraph>
      <SubHeading>3. التغييرات والرسوم</SubHeading>
      <Paragraph>
        تحتفظ Hanuut Express بالحق في إجراء تغييرات على التطبيق أو فرض رسوم على
        خدماتها في أي وقت ولأي سبب. ولن نفرض عليك أي رسوم على التطبيق أو خدماته
        دون أن نوضح لك بوضوح ما الذي تدفعه بالضبط.
      </Paragraph>
      <SubHeading>4. البيانات الشخصية والأمان</SubHeading>
      <Paragraph>
        يقوم تطبيقHanuut بتخزين ومعالجة البيانات الشخصية التي قدمتها لنا لتقديم
        خدمتنا. من مسؤوليتك الحفاظ على هاتفك والوصول إلى التطبيق بشكل آمن.
        ولذلك، نوصيك بعدم إجراء عملية جيلبريك أو روت لهاتفك، وهي عملية إزالة
        القيود والتحديات البرمجية التي تفرضها نظام التشغيل الرسمي لجهازك. قد
        تجعل هذه العملية هاتفك عرضة للبرامج الخبيثة / الفيروسات / البرامج
        الضارة، وتعرض ميزات أمان هاتفك للخطر، ويمكن أن يعني أن تطبيق Hanuut لن
        يعمل بشكل صحيح أو على الإطلاق.
      </Paragraph>
      <SubHeading>5. خدمات الطرف الثالث</SubHeading>
      <Paragraph>
        يستخدم التطبيق خدمات الطرف الثالث التي تعلن عن شروطها وأحكامها.
      </Paragraph>
      <List>
        <ListItem>
          <Link
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            خدمات Google Play
          </Link>
        </ListItem>
      </List>
      <SubHeading>6. قيود المسؤولية</SubHeading>
      <Paragraph>
        يجب أن تكون على علم بأن هناك بعض الأمور التي لن يتحمل Hanuut Express
        مسؤوليتها عنها. ستتطلب بعض وظائف التطبيق وجود اتصال إنترنت نشط. يمكن أن
        يكون الاتصال عبر Wi-Fi أو من خلال مزود خدمة الشبكة المحمولة الخاص بك،
        ولكن لا يستطيع Hanuut Express تحمل مسؤولية عدم عمل التطبيق بكامل وظائفه
        إذا لم يكن لديك وصول إلى Wi-Fi، وإذا لم يكن لديك أي من حصة بياناتك
        المتاحة.
      </Paragraph>
      <Paragraph>
        إذا كنت تستخدم التطبيق خارج منطقة Wi-Fi، فيجب عليك تذكر أن شروط الاتفاق
        مع مزود خدمة الشبكة المحمولة سوف تنطبق عليك. وبالتالي، قد يتم فرض رسوم
        من قبل مزود الشبكة المحمولة لتكلفة البيانات خلال فترة الاتصال أثناء
        الوصول إلى التطبيق، أو رسوم الطرف الثالث الأخرى. باستخدام التطبيق، فإنك
        تتحمل المسؤولية عن أي من هذهذه الرسوم، بما في ذلك رسوم بيانات التجوال
        إذا استخدمت التطبيق خارج منطقتك المنزلية (أي المنطقة أو البلد). إذا لم
        تكن صاحب الفاتورة للجهاز الذي تستخدمه للتطبيق، يرجى ملاحظة أننا نفترض
        أنك قد حصلت على إذن من صاحب الفاتورة لاستخدام التطبيق.
      </Paragraph>
      <Paragraph>
        بالإضافة إلى ذلك، لا يمكن لـ Hanuut Express دائمًا تحمل المسؤولية عن
        الطريقة التي تستخدم بها التطبيق، على سبيل المثال، يجب عليك التأكد من أن
        جهازك مشحون - إذا نفدت البطارية ولم تتمكن من تشغيله للاستخدام الخدمة،
        فإن Hanuut Express لا يمكنها قبول المسؤولية عن ذلك.
      </Paragraph>
      <Paragraph>
        وفيما يتعلق بمسؤولية Hanuut Express عن استخدامك للتطبيق، فيجب عليك أن
        تضع في اعتبارك أننا نعتمد على أطراف ثالثة لتزويدنا بالمعلومات حتى نتمكن
        من توفيرها لك. ولا يتحمل Hanuut Express أي مسؤولية عن أي خسارة مباشرة أو
        غير مباشرة تواجهك نتيجة الاعتماد بشكل كامل على هذه الوظيفة في التطبيق.
      </Paragraph>
      <SubHeading>7. الاستخدام الصحيح</SubHeading>
      <Paragraph>
        يجب أن تتعامل مع التطبيق ومع المستخدمين الآخرين بطريقة مهذبة ومحترمة، ولا يجوز لك استخدام التطبيق بأي طريقة تتسبب في الإضرار بالتطبيق أو بأي مستخدم آخر. ويحظر بشكل صريح استخدام التطبيق لأي أغراض غير قانونية أو غير أخلاقية، بما في ذلك ولكن لا يقتصر على الاستخدام للترويج أو الشحن غير المشروع للمواد أو المنتجات المحظورة.
      </Paragraph>
      <SubHeading>8. إنهاء الخدمة</SubHeading>
      <Paragraph>
        يحتفظ Hanuut Express بالحق في إنهاء خدماتها أو التطبيق في أي وقت دون إشعار مسبق. ويجوز لك أيضًا إنهاء استخدام التطبيق في أي وقت. ولكن يجب عليك ملاحظة أنه عند إنهاء استخدام التطبيق، فإنك لا تحذف بياناتك الشخصية التي قدمتها لنا سابقًا. وسيتم تخزين بياناتك الشخصية وفقًا لسياسة الخصوصية الخاصة بنا.
      </Paragraph>
      <SubHeading>8. إنهاء الخدمة</SubHeading>
      <Paragraph>
        يحتفظ Hanuut Express بالحق في إنهاء خدماتها أو التطبيق في أي وقت دون إشعار مسبق. ويجوز لك أيضًا إنهاء استخدام التطبيق في أي وقت. ولكن يجب عليك ملاحظة أنه عند إنهاء استخدام التطبيق، فإنك لا تحذف بياناتك الشخصية التي قدمتها لنا سابقًا. وسيتم تخزين بياناتك الشخصية وفقًا لسياسة الخصوصية الخاصة بنا.
      </Paragraph>
      <SubHeading>10. القانون الساري</SubHeading>
      <Paragraph>
        تخضع هذه الشروط والأحكام للقوانين السارية في الدولة التي تعمل بها Hanuut Express. وتخضع أي نزاعات تنشأ عن هذه الشروط والأحكام للقضاء المختص في الدولة التي تعمل بها Hanuut Express.
      </Paragraph>
      <SubHeading>10. القانون الساري</SubHeading>
      <Paragraph>
        تخضع هذه الشروط والأحكام للقوانين السارية في الدولة التي تعمل بها Hanuut Express. وتخضع أي نزاعات تنشأ عن هذه الشروط والأحكام للقضاء المختص في الدولة التي تعمل بها Hanuut Express.
      </Paragraph>
      <SubHeading>12. الخلاصة</SubHeading>
      <Paragraph>
        تحدد هذه الشروط والأحكام العلاقة بين Hanuut Express والمستخدمين فيما يتعلق باستخدام التطبيق. يجب عليك قراءتها بعناية للتأكد من فهمك لجميع الشروط المحددة فيها. إذا كنت لا توافق على أي من هذه الشروط، فيجب عليك التوقف عن استخدام التطبيق على الفور. وإذا استمريت في استخدام التطبيق، فإن ذلك يعني موافقتك على جميع الشروط والأحكام المذكورة فيها. ويجب عليك الالتزام بجميع الشروط والأحكام والقوانين السارية في الدولة التي تعمل بها Hanuut Express عند استخدام التطبيق. </Paragraph>
    </Container>
  ) : (
    <Container>
      <Heading>Terms and Conditions</Heading>

      <SubHeading>1. Introduction</SubHeading>
      <Paragraph>
        By downloading or using the app, these terms will automatically apply to
        you – you should make sure therefore that you read them carefully before
        using the app.
      </Paragraph>

      <SubHeading>2. Restrictions</SubHeading>
      <Paragraph>
        You’re not allowed to copy or modify the app, any part of the app, or
        our trademarks in any way. You’re not allowed to attempt to extract the
        source code of the app, and you also shouldn’t try to translate the app
        into other languages or make derivative versions. The app itself, and
        all the trademarks, copyright, database rights, and other intellectual
        property rights related to it, still belong to Hanuut Express.
      </Paragraph>

      <SubHeading>3. Changes and Charges</SubHeading>
      <Paragraph>
        Hanuut Express reserves the right to make changes to the app or to
        charge for its services, at any time and for any reason. We will never
        charge you for the app or its services without making it very clear to
        you exactly what you’re paying for.
      </Paragraph>

      <SubHeading>4. Personal Data and Security</SubHeading>
      <Paragraph>
        The Hanuut app stores and processes personal data that you have provided
        to us, to provide our Service. It’s your responsibility to keep your
        phone and access to the app secure. We therefore recommend that you do
        not jailbreak or root your phone, which is the process of removing
        software restrictions and limitations imposed by the official operating
        system of your device. It could make your phone vulnerable to
        malware/viruses/malicious programs, compromise your phone’s security
        features and itcould mean that the Hanuut app won’t work properly or at
        all.
      </Paragraph>

      <SubHeading>5. Third-Party Services</SubHeading>
      <Paragraph>
        The app does use third-party services that declare their Terms and
        Conditions.
      </Paragraph>
      <List>
        <ListItem>
          <Link
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Play Services
          </Link>
        </ListItem>
      </List>

      <SubHeading>6. Limitations of Responsibility</SubHeading>
      <Paragraph>
        You should be aware that there are certain things that Hanuut Express
        will not take responsibility for. Certain functions of the app will
        require the app to have an active internet connection. The connection
        can be Wi-Fi or provided by your mobile network provider, but Hanuut
        Express cannot take responsibility for the app not working at full
        functionality if you don’t have access to Wi-Fi, and you don’t have any
        of your data allowance left.
      </Paragraph>
      <Paragraph>
        If you’re using the app outside of an area with Wi-Fi, you should
        remember that the terms of the agreement with your mobile network
        provider will still apply. As a result, you may be charged by your
        mobile provider for the cost of data for the duration of the connection
        while accessing the app, or other third-party charges. In using the app,
        you’re accepting responsibility for any such charges, includingroaming
        data charges if you use the app outside of your home territory (i.e.
        region or country) without turning off data roaming. If you are not the
        bill payer for the device on which you’re using the app, please be aware
        that we assume that you have received permission from the bill payer for
        using the app.
      </Paragraph>
      <Paragraph>
        Along the same lines, Hanuut Express cannot always take responsibility
        for the way you use the app i.e. You need to make sure that your device
        stays charged – if it runs out of battery and you can’t turn it on to
        avail the Service, Hanuut Express cannot accept responsibility.
      </Paragraph>
      <Paragraph>
        With respect to Hanuut Express’s responsibility for your use of the app,
        when you’re using the app, it’s important to bear in mind that although
        we endeavor to ensure that it is updated and correct at all times, we do
        rely on third parties to provide information to us so that we can make
        it available to you. Hanuut Express accepts no liability for any loss,
        direct or indirect, you experience as a result of relying wholly on this
        functionality of the app.
      </Paragraph>

      <SubHeading>7. Updates and Termination</SubHeading>
      <Paragraph>
        At some point, we may wish to update the app. The app is currently
        available on Android &amp; iOS – the requirements for the both systems
        (and for any additionalsystems we decide to extend the availability of
        the app to) may change, and you’ll need to download the updates if you
        want to keep using the app. Hanuut Express does not promise that it will
        always update the app so that it is relevant to you and/or works with
        the Android &amp; iOS version that you have installed on your device.
        However, you promise to always accept updates to the application when
        offered to you. We may also wish to stop providing the app, and may
        terminate use of it at any time without giving notice of termination to
        you. Unless we tell you otherwise, upon any termination, (a) the rights
        and licenses granted to you in these terms will end; (b) you must stop
        using the app, and (if needed) delete it from your device.
      </Paragraph>
      <SubHeading>8. Changes to This Terms and Conditions</SubHeading>
      <Paragraph>
        We may update our Terms and Conditions from time to time. Thus, you are
        advised to review this page periodically for any changes. We will notify
        you of any changes by posting the new Terms and Conditions on this page.
      </Paragraph>

      <SubHeading>9. Contact Us</SubHeading>
      <Paragraph>
        If you have any questions or suggestions about our Terms and Conditions,
        do not hesitate to contact us at{" "}
        <Link href="mailto:contact@hanuut.com">contact@hanuut.com</Link>.
      </Paragraph>
    </Container>
  );
};

export default TermsAndConditions;
