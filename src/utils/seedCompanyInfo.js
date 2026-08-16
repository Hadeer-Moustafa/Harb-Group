import { CompanyInfo } from "../../DB/models/admin/companyInfo.model.js";

export const seedCompanyInfo = async () => {
 try {
    const count = await CompanyInfo.countDocuments();

    if (count === 0) {
      await CompanyInfo.create({
        nameAr: "حرب للمقاولات والتوريدات العامة",
        nameEn: "Harb Contracting and General Supplies",
        descriptionAr:"شركة رائدة في تصنيع الفولاذ والمقاولات تعمل في منطقة الخليج العربي بخبرة تزيد على 20 عاماً.",
        descriptionEn: "A leading steel fabrication and contracting company operating across the GCC region with over 20 years of experience.",
        logo:{url:"https://res.cloudinary.com/o61ytilj/image/upload/v1786846831/logo.jpg",public_id:"logo"} ,
        address: "Industrial Area, Sharjah, UAE",
        email: "info@harbgroup.com",
        phoneNumbers: {
          main: "+971600000000",
          sales: "+971500000000"
        },
        googleMapsUrl: "https://maps.google.com/?q=Sharjah+Industrial+Area",
        workingHours:"Sun–Thu: 8:00 AM – 6:00 PM, Fri–Sat: Closed",
        socialMediaLinks: {
          facebook: "https://facebook.com/harbgroup",
          linkedin: "https://linkedin.com/company/harbgroup",
          instagram: "https://instagram.com/harbgroup"
        }
      });

      console.log("Company Info seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding Company Info:", error.message);
  }
};