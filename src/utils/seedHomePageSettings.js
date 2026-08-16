import { HomepageSettings } from "../../DB/models/admin/homePage.model.js";

export const seedHomepageSettings = async () => {
  try {
    const count = await HomepageSettings.countDocuments();
    if (count === 0) {
      await HomepageSettings.create({
        heroTitleAr: "شريكك الموثوق في تصنيع الفولاذ",
        heroTitleEn: "Your Trusted Steel Fabrication Partner",
        heroSubtitleAr:
          "حلول فولاذية عالية الجودة للمشاريع الإنشائية والصناعية في منطقة الخليج.",
        heroSubtitleEn:
          "Quality steel solutions for construction and industrial projects across the GCC region.",
      });
      console.log("Homepage Settings seeded successfully.");
    }
  } catch (error) {
    console.error("Error seeding Homepage Settings:", error.message);
  }
};
