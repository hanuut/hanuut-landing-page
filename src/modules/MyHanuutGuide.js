import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import AppLogo from "../assets/myHanuutLogo2.webp";
import BackgroundImage from "../assets/background.webp";
import Windows from "../assets/windows.svg";
import Playstore from "../assets/playstore.webp";
import ButtonWithIcon from "../components/ButtonWithIcon";
import { Link } from "react-router-dom";
import Shop from "../assets/icons/shop.svg";
import Illustration from "../assets/illustrations/guideIllustration.png";
import DesktopIllustration from "../assets/illustrations/desktopIllustration.png";
import DesktopIllustration2 from "../assets/illustrations/desktopIllustration2.png";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${BackgroundImage});
  background-size: 100%;
  background-color: rgba(${(props) => props.theme.orangeColorRgba}, 0.1);
  background-position: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  direction: rtl;
  gap: 4rem;
  padding-bottom: 4rem;
  @media (max-width: 768px) {
    width: 90%;
    gap: 2rem;
  }
`;

const ContainerTitle = styled.h1`
  width: 100%;
  border-radius: ${(props) => props.theme.bigRadius};
  background-color: rgba(${(props) => props.theme.orangeColorRgba}, 0.3);
  text-align: center;
  font-weight: 200;
  padding: 1rem 0;
`;

const ContainerTitleWithElements = styled.div`
  width: 100%;
  display: flex;
  flex-direct: row;
  align-items: center;
  justify-content: space-between;
  border-radius: ${(props) => props.theme.bigRadius};
  background-color: rgba(${(props) => props.theme.orangeColorRgba}, 0.3);
  padding: 1rem 0;
`;

const AppCart = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
`;

const AppLogoImage = styled.img`
  width: 10rem;
  height: 10rem;
  @media (max-width: 768px) {
    width: 6rem;
    height: 6rem;
  }
`;

const AppInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
`;
const AppName = styled.h1`
  font-size: 4rem;
  font-weight: 300;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontLargest};
  }
`;
const ButtonsRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;
const Heading = styled.h1`
  max-width: 80%;
  font-size: 4rem;
  font-weight: 900;
  padding: 0 1rem;
  color: ${(props) => props.theme.orangeColor};
  span {
    color: ${(props) => props.theme.primaryColor};
  }
  &.medium {
    font-size: ${(props) => props.theme.fontLargest};
    @media (max-width: 768px) {
      max-width: 100%;
      font-size: ${(props) => props.theme.fontxxxl};
    }
  }
  &.black {
    color: ${(props) => props.theme.text};
  }
  &.small {
    font-size: ${(props) => props.theme.fontxxxl};
  }
  &.start {
    padding: 0;
    align-self: flex-start;
  }
  @media (max-width: 768px) {
    max-width: 90%;
    font-size: ${(props) => props.theme.fontLargest};
  }
`;

const Paragraph = styled.p`
  max-width: 80%;
  font-weight: 300;
  font-size: ${(props) => props.theme.fontLargest};
  @media (max-width: 768px) {
    max-width: 90%;
    font-size: ${(props) => props.theme.fontxxxl};
  }
  &.medium {
    font-size: ${(props) => props.theme.fontxxxl};
    @media (max-width: 768px) {
      max-width: 100%;
      font-size: ${(props) => props.theme.fontxl};
    }
  }

  &.orange {
    color: ${(props) => props.theme.orangeColor};
  }
  &.green {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const WhiteContainer = styled.div`
  padding: 2rem 0;
  width: 80%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.bigRadius};
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const GuideRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;
const GuideIllustration = styled.img`
  width: 40%;
  height: auto;
  objec-fit: cover;
  @media (max-width: 768px) {
    width: 40%;
  }
  &.fullWidth {
    width: 100%;
    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;
const GuideContentColumn = styled.div`
  width: 55%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 4rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const GuideElement = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const MyHanuutGuide = () => {
  const { t, i18n } = useTranslation();
  const myHanuutDownloadLinkWindows =
    process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK;
  const myHanuutDownloadLink =
    process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY;

  const handleDownloadPlay = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLink);
  };
  const handleDownloadWindows = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLinkWindows);
  };
  const handleJoinClick = (e) => {
    e.preventDefault();
    window.open("/partners");
  };

  return (
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <ContainerTitle>دليل برنامج ماي حـــــانووت</ContainerTitle>
        <AppCart>
          <AppLogoImage src={AppLogo}  alt="guide-illustration"/>
          <AppInfo>
            <AppName>MY Hanuut</AppName>
            <ButtonsRow>
              <ButtonWithIcon
                image={Playstore}
                backgroundColor="#000000"
                text1={t("getItOn")}
                text2={t("googlePlay")}
                className="homeDownloadButton"
                onClick={(e) => handleDownloadPlay(e)}
              ></ButtonWithIcon>
              <ButtonWithIcon
                image={Windows}
                backgroundColor="#000000"
                text1={t("getItOn")}
                text2={"Windows"}
                className="homeDownloadButton"
                onClick={(e) => handleDownloadWindows(e)}
              ></ButtonWithIcon>
            </ButtonsRow>
          </AppInfo>
        </AppCart>
        <Heading>
          دليل برنامج <span>ماي حـــــانووت</span> لإدارة محلك التجاري و تعزيز
          تواجدك الرقمي
        </Heading>
        <Paragraph>
          الحل المناسب لإدارة محل البقالة أو المطعم الخاص بك ! تم تصميم برنامجنا
          لمساعدة أصحاب المحالت مثلك على تبسيط العمليات، إدارة المستودع، والبيع
          عبر الإنترنت بسهولة. سيرشدك هذا الدليل عبر جميع ميزات برنامجنا
        </Paragraph>

        <WhiteContainer onClick={(e) => handleJoinClick(e)}>
          <Heading className="black">إنضم لحانووت الآن</Heading>
          <Paragraph>أطلب نسختك الآن من خالل تسجيل طلبك</Paragraph>
        </WhiteContainer>
      </Container>{" "}
      <Container isArabic={i18n.language === "ar"}>
        <ContainerTitleWithElements>
          <ButtonWithIcon
            image={Shop}
            backgroundColor="transparent"
            text2={"المتجر"}
            className="homeDownloadButton blackText"
          ></ButtonWithIcon>
          <Heading className="small black">دليل برنامج ماي حـــــانووت</Heading>
        </ContainerTitleWithElements>
        <Heading className="black start medium">إدارة المتجر</Heading>
        <GuideRow>
          <GuideIllustration src={Illustration} alt="guide-illustration" />
          <GuideContentColumn>
            <GuideElement>
              {" "}
              <Heading className="black start medium">خصائص المتجر</Heading>
              <Paragraph className="black start medium">
                اجعل محلك مميزًا بتخصيص معلوماته. إليك ما يمكنك فعله
              </Paragraph>
            </GuideElement>

            <GuideElement>
              {" "}
              <Heading className="black start medium">الشعار والاسم</Heading>
              <Paragraph className="black start medium">
                قم بتحميل شعارك وتحديد اسم محلك.
              </Paragraph>
            </GuideElement>

            <GuideElement>
              {" "}
              <Heading className="black start medium">الوصف</Heading>
              <Paragraph className="black start medium">
                أضف وصفًا جذابًا لجذب العملاء
              </Paragraph>
            </GuideElement>

            <GuideElement>
              {" "}
              <Heading className="black start medium">
                أيام وساعات العمل
              </Heading>
              <Paragraph className="black start medium">
                قم بتحديد ساعات العمل
              </Paragraph>
            </GuideElement>

            <GuideElement>
              {" "}
              <Heading className="black start medium">خيارات التوصيل</Heading>
              <Paragraph className="black start medium">
                اختر بين خدمات التوصيل والاستلام
              </Paragraph>
            </GuideElement>

            <GuideElement>
              {" "}
              <Heading className="black start medium">مناطق الخدمة</Heading>
              <Paragraph className="black start medium">
                حدد المناطق التي تخدمها
              </Paragraph>
            </GuideElement>
          </GuideContentColumn>
        </GuideRow>
      </Container>
      <Container isArabic={i18n.language === "ar"}>
        <GuideRow>
          <GuideIllustration src={Illustration} alt="guide-illustration" /> {/* changeIllustratio */}
          <GuideContentColumn>
            <GuideElement>
              {" "}
              <Heading className="black start medium">عرض نشاط المحل</Heading>
              <Paragraph className="black start medium">
                ابقَ على اطلاع على نشاط عملك من خلال رؤى فورية
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">نظرة مالية</Heading>
              <Paragraph className="black start medium">
                تتبع الأموال الداخلة والخارجة
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">تقارير النشاط</Heading>
              <Paragraph className="black start medium">
                احصل على تقارير مفصلة عن أداء محلك
              </Paragraph>
            </GuideElement>
            <GuideIllustration src={Illustration}  alt="guide-illustration"/> {/* changeIllustratio */}
            <GuideElement>
              {" "}
              <Heading className="black start medium">إدارة حسابك</Heading>
              <Paragraph className="black start medium">
                قم بتحديث تفاصيل حسابك بسهولة عند الحاجة
              </Paragraph>
            </GuideElement>
          </GuideContentColumn>
        </GuideRow>
      </Container>
      <Container isArabic={i18n.language === "ar"}>
        <ContainerTitleWithElements>
          <ButtonWithIcon
            image={Shop}
            backgroundColor="transparent"
            text2={"المتجر"}
            className="homeDownloadButton blackText"
          ></ButtonWithIcon>
          <Heading className="small black">دليل برنامج ماي حـــــانووت</Heading>
        </ContainerTitleWithElements>
        <Heading className="black start medium">إدارة المبيعات</Heading>
        <GuideElement>
          {" "}
          <Heading className="black start medium">تسجيل المبيعات</Heading>
          <Paragraph className="black start medium">
            ابقَ على اطلاع على نشاط عملك من خلال رؤى فورية سجل جميع مبيعاتك
            المحلية في النظام للحصول على سجلات دقيقة
          </Paragraph>
        </GuideElement>
        <GuideIllustration className="fullWidth" src={DesktopIllustration}  alt="guide-illustration"/>{" "}
        <GuideRow>
          {/* changeIllustratio */}
          <GuideContentColumn>
            <GuideElement>
              {" "}
              <Heading className="black start medium">تقارير المبيعات</Heading>
              <Paragraph className="black start medium">
                احصل على تقارير تفصيلية حول أداء مبيعاتك المحلية، مما يساعدك على
                اتخاذ قرارات مدروسة لتحسين أعمالك
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">إدارة المخزون</Heading>
              <Paragraph className="black start medium">
                تحديث المخزون تلقائيًا بعد كل عملية بيع مسجلة، مما يضمن أنك تعرف
                دائمًا ما هو متاح في المستودع
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">تقارير مفصلة</Heading>
              <Paragraph className="black start medium">
                الحصول على رؤى وتحليلات تساعدك على إدارة أعمالك بفعالية
              </Paragraph>
            </GuideElement>
          </GuideContentColumn>
        </GuideRow>
      </Container>
      <Container isArabic={i18n.language === "ar"}>
        <ContainerTitleWithElements>
          <ButtonWithIcon
            image={Shop}
            backgroundColor="transparent"
            text2={"المنتجات"}
            className="homeDownloadButton blackText"
          ></ButtonWithIcon>
          <Heading className="small black">دليل برنامج ماي حـــــانووت</Heading>
        </ContainerTitleWithElements>
        <Heading className="black start medium">إدارة المنتجات</Heading>
        <GuideRow>
          <GuideIllustration src={Illustration} alt="guide-illustration" />
          <GuideContentColumn>
            <GuideElement>
              {" "}
              <Heading className="black start medium">
                نظرة عامة على المستودع
              </Heading>
              <Paragraph className="black start medium">
                حافظ على تنظيم وكفاءة مستودعك
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">قائمة المنتجات</Heading>
              <Paragraph className="black start medium">
                عرض جميع المنتجات المتاحة بنظرة واحدة
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">
                المنتجات المنتهية الصلاحية
              </Heading>
              <Paragraph className="black start medium">
                تحديد وإدارة العناصر المنتهية الصلاحية
              </Paragraph>
            </GuideElement>
            <GuideIllustration src={Illustration}  alt="guide-illustration"/> {/* changeIllustratio */}
          </GuideContentColumn>
        </GuideRow>
      </Container>
      <Container isArabic={i18n.language === "ar"}>
        <GuideRow>
          <GuideIllustration src={Illustration}  alt="guide-illustration"/>
          <GuideContentColumn>
            <GuideElement>
              {" "}
              <Heading className="black start medium">
                إدارة تفاصيل المنتجات بسهولة
              </Heading>
              <Paragraph className="black start medium">
                تبسيط إدارة المخزون مع ميزة مسح الباركود لدينا
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">الإضافة السريعة</Heading>
              <Paragraph className="black start medium">
                إضافة المنتجات إلى المستودع دون إدخال يدوي بفضل قاعدة بيانتنا
                المتجددة
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">مسح الباركود</Heading>
              <Paragraph className="black start medium">
                مسح الباركود لإضافة أو تحديث المنتجات بسرعة
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">تعديل المعلومات</Heading>
              <Paragraph className="black start medium">
                تعديل تفاصيل المنتجات عند الحاجة
              </Paragraph>
            </GuideElement>
            <GuideIllustration src={Illustration}  alt="guide-illustration"/> {/* changeIllustratio */}
          </GuideContentColumn>
        </GuideRow>
      </Container>
      <Container isArabic={i18n.language === "ar"}>
        <ContainerTitleWithElements>
          <ButtonWithIcon
            image={Shop}
            backgroundColor="transparent"
            text2={"المتجر"}
            className="homeDownloadButton blackText"
          ></ButtonWithIcon>
          <Heading className="small black">دليل برنامج ماي حـــــانووت</Heading>
        </ContainerTitleWithElements>
        <Heading className="black start medium">إدارة المبيعات</Heading>
        <GuideElement>
          {" "}
          <Heading className="black start medium">
            تعزيز إدارة المبيعات المحلية
          </Heading>
          <Paragraph className="black start medium">
            يقدم نظام نقاط البيع الخاص بنا ميزة قوية لمساعدتك في إدارة مبيعاتك
            المحلية بسهولة وكفاءة. إليك كيف يمكن أن يساعدك
          </Paragraph>
        </GuideElement>
        <GuideIllustration className="fullWidth" src={DesktopIllustration2}  alt="guide-illustration"/>{" "}
        <GuideRow>
          {/* changeIllustratio */}
          <GuideContentColumn>
            <GuideElement>
              {" "}
              <Heading className="black start medium">مسح الباركود</Heading>
              <Paragraph className="black start medium">
                استخدم جهاز الباركود لمسح المنتجات المشتراة محليًا من قبل
                العملاء، مما يضمن دقة وسرعة في عملية التسجيل
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">
                اختيار المنتجات من المستودع
              </Heading>
              <Paragraph className="black start medium">
                يمكنك اختيار المنتجات يدويًا من قائمة المستودع أو من خلال البحث
                بسهولة
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">منتجات أخرى</Heading>
              <Paragraph className="black start medium">
                إذا كانت هناك منتجات غير مسجلة في المستودع أو تحتاج إلى إضافتها
                يدويًا إلى الحساب الإجمالي، يمكنك القيام بذلك بسرعة وسهولة من
                خلال واجهة المستخدم
              </Paragraph>
            </GuideElement>
          </GuideContentColumn>
        </GuideRow>
      </Container>
      <Container isArabic={i18n.language === "ar"}>
        <ContainerTitleWithElements>
          <ButtonWithIcon
            image={Shop}
            backgroundColor="transparent"
            text2={"المنتجات"}
            className="homeDownloadButton blackText"
          ></ButtonWithIcon>
          <Heading className="small black">دليل برنامج ماي حـــــانووت</Heading>
        </ContainerTitleWithElements>
        <Heading className="black start medium">إدارة الطلبات</Heading>
        <GuideRow>
          <GuideIllustration src={Illustration} alt="guide-illustration" />
          <GuideContentColumn>
            <GuideElement>
              {" "}
              <Heading className="black start medium">استلام الطلبات</Heading>
              <Paragraph className="black start medium">
                بمجرد تفعيل متجرك عبر الإنترنت، يمكنك البدء في استلام الطلبات
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">إشعارات الطلبات</Heading>
              <Paragraph className="black start medium">
                الحصول على تنبيهات فورية للطلبات الجديدة
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">تفاصيل الطلب</Heading>
              <Paragraph className="black start medium">
                عرض معلومات مفصلة عن كل طلب
              </Paragraph>
            </GuideElement>{" "}
            <GuideElement>
              {" "}
              <Heading className="black start medium">
                تأكيد أو إلغاء الطلبات
              </Heading>
              <Paragraph className="black start medium">
                تحديد الطلبات التي ستقوم بتلبيتها
              </Paragraph>
            </GuideElement>
            <GuideElement>
              {" "}
              <Heading className="black start medium">تجهيز الطلبات</Heading>
              <Paragraph className="black start medium">
                جمع العناصر وتجهيزها للتوصيل أو الاستلام
              </Paragraph>
            </GuideElement>
            <GuideIllustration src={Illustration}  alt="guide-illustration"/> {/* changeIllustratio */}
          </GuideContentColumn>
        </GuideRow>
      </Container>
      <Container isArabic={i18n.language === "ar"}>
        <ContainerTitle>دليل برنامج ماي حـــــانووت</ContainerTitle>
        <Heading className="black"> التحسين المستمر</Heading>
        <Paragraph>
          نحن ملتزمون بتحسين برامجنا و استخدام أحدث التكنولوجيات باستمرار
          لخدمتكم بشكل أفضل
        </Paragraph>
        <Paragraph className="orange">
          يعمل فريقنا بشكل وثيق مع أصحاب المحلات لتطوير ميزات جديدة ومثيرة من
          شأنها أن تأخذ عملك إلى المستوى التالي
        </Paragraph>
        <Paragraph className="green">
          معًا، نسعى لإنشاء علاقة أقوى مع عملائك من خلال تحسين تجربتهم التسوقية
        </Paragraph>

        <WhiteContainer onClick={(e) => handleJoinClick(e)}>
          <Heading className="black">إنضم لحانووت الآن</Heading>
          <Paragraph>أطلب نسختك الآن من خالل تسجيل طلبك</Paragraph>
        </WhiteContainer>
        <Paragraph>
          أختر ماي حانووت لإدارة محل البقالة الخاص بك أو مطعمك. نحن هنا لدعمك في
          كل خطوة على الطريق. إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، لا
          تتردد في الاتصال بفريق الدعم الخاص بنا
        </Paragraph>
      </Container>{" "}
    </Section>
  );
};

export default MyHanuutGuide;
