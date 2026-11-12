"use strict";
const subjects=[
["Toán","stem","∑","Chứng minh, đại số, hình học, tổ hợp, xác suất; mô hình hóa.","Toán học · AI · kinh tế lượng"],
["Vật lý","stem","φ","Cơ học, điện từ, sóng, nhiệt; thí nghiệm, phân tích sai số.","Vật lý · bán dẫn · năng lượng"],
["Hóa học","stem","H₂","Hóa lý, hữu cơ, vô cơ, phân tích và thực nghiệm an toàn.","Vật liệu · hóa dược · môi trường"],
["Sinh học","stem","DNA","Di truyền, tế bào, tiến hóa, sinh thái và khoa học sự sống.","Y sinh · công nghệ sinh học"],
["Tin học","stem","{ }","Thuật toán, cấu trúc dữ liệu, hệ thống và kiểm thử phần mềm.","Khoa học máy tính · AI · robot"],
["Ngữ văn","social","Aa","Nghiên cứu văn bản, ngôn ngữ, lý luận và sáng tạo.","Văn học · ngôn ngữ · văn hóa"],
["Lịch sử","social","⌛","Sử liệu, tư duy bối cảnh, lập luận và phê bình nguồn.","Sử học · chính sách · giáo dục"],
["Địa lý","social","◎","Không gian, môi trường, dân cư, địa lý kinh tế và GIS.","Quy hoạch · môi trường · xã hội"],
["Tiếng Anh","language","EN","Ngôn ngữ học, đọc và viết học thuật, giao tiếp liên văn hóa.","Nghiên cứu · ngoại giao · giáo dục"],
["Tiếng Pháp","language","FR","Pháp ngữ, dịch thuật học thuật và nghiên cứu văn hóa.","Pháp ngữ · ngoại giao · giáo dục"],
["Tiếng Trung","language","中","Hán ngữ, nghiên cứu khu vực và phân tích nguồn đa ngôn ngữ.","Nghiên cứu khu vực · thương mại"],
["Nga","language","RU","Ngôn ngữ Nga, văn học và văn hóa Nga, kỹ năng dịch thuật, nghiên cứu khu vực và đọc hiểu tài liệu học thuật.","Ngôn ngữ học · nghiên cứu khu vực · ngoại giao"]];
const math=[
["Lập luận và chứng minh","Logic, tập hợp, biến đổi đại số, số học và kỹ thuật chứng minh.","Seminar nhiều cách giải; tìm phản ví dụ.","Bài chứng minh độc lập và thử thách chuyển giao."],
["Hình học, tổ hợp và xác suất","Hình học Euclid, vectơ, nguyên lý đếm và xác suất hữu hạn.","Phân tích bài toán tổ hợp mở; mô phỏng để kiểm chứng.","Báo cáo hai phương pháp và nhật ký kiểm chứng."],
["Hàm số và tư duy giới hạn","Dãy số, truy hồi, giới hạn, hàm số và các bài toán tối ưu.","Mô hình hóa bằng dữ liệu thật, đánh giá giả định.","Báo cáo mô hình cùng phân tích sai số."],
["Giải tích và thống kê","Đạo hàm, cực trị, xác suất có điều kiện, lấy mẫu và ước lượng.","Nghiên cứu nhỏ về chọn mẫu và độ bất định.","Báo cáo có dữ liệu, lập luận và phản biện."],
["Tích phân, tối ưu và số học ứng dụng","Tích phân, ứng dụng hình học và vật lý, thuật toán số.","Mô phỏng tối ưu vận tải, năng lượng hoặc thông tin.","Đề án tối ưu và thảo luận trường hợp biên."],
["Bảo vệ nghiên cứu Toán","Tổng hợp các miền Toán và làm quen phương pháp nghiên cứu.","Chuyên đề sâu hoặc bài toán ứng dụng, có phản biện.","Hồ sơ năng lực và bài bảo vệ độc lập."]];
const physics=[
["Đo lường và cơ học","Đơn vị, sai số, vectơ, động học và định luật Newton.","Đo chuyển động bằng video hoặc cảm biến.","Báo cáo tái lập được, đồ thị và sai số."],
["Năng lượng và hệ cơ học","Công, động lượng, năng lượng, bảo toàn và ma sát.","Đo tổn thất năng lượng hoặc hệ số ma sát.","Bộ dữ liệu, mô hình và giải thích độ bất định."],
["Dao động và sóng","Dao động điều hòa, tắt dần, sóng, giao thoa và cộng hưởng.","Đo dao động, so sánh mô hình lý tưởng và thực.","Báo cáo thí nghiệm và nhiệm vụ chuyển giao."],
["Điện trường, mạch và cảm biến","Điện tích, điện trường, điện thế và mạch điện an toàn.","Mô phỏng và đo trên mạch hạ áp phù hợp.","Sơ đồ mạch, dữ liệu và nhận định độ tin cậy."],
["Nhiệt, điện từ và vật lý hiện đại","Nhiệt học, từ trường, cảm ứng, quang và lượng tử nhập môn.","Mô phỏng linh kiện, năng lượng hoặc trường điện từ.","Báo cáo kiểm định mô hình và giới hạn."],
["Bảo vệ nghiên cứu Vật lý","Tổng hợp cơ, nhiệt, điện từ và nghiên cứu thực nghiệm.","Đề tài nhỏ, thử nghiệm an toàn và phản biện.","Hồ sơ nghiên cứu, dữ liệu và bảo vệ độc lập."]];
const technology=[
["AI và công nghệ số","AI tiếng Việt, dữ liệu và điện toán."],
["Mạng di động thế hệ sau","Sóng và hạ tầng viễn thông."],
["Robot và tự động hóa","Điều khiển, cảm biến và sản xuất."],
["Sinh học và y sinh","Khoa học sự sống và sức khỏe."],
["Năng lượng và vật liệu","Pin, hydrogen và vật liệu tiên tiến."],
["Bán dẫn","Thiết kế, mô phỏng và kiểm thử chip."],
["An ninh mạng và lượng tử","Mật mã, bảo mật và lượng tử."],
["Biển, đại dương và lòng đất","Địa chất, tài nguyên và dữ liệu biển."],
["Hàng không và vũ trụ","Viễn thám, vệ tinh và khí động học."],
["Đường sắt và đô thị","Điều khiển, quy hoạch và tối ưu."]];
const resources=[
["math","TOÁN · OLYMPIC","International Mathematical Olympiad","Đề thi Olympic Toán quốc tế.","https://www.imo-official.org/"],
["math","TOÁN · CHUYÊN SÂU","Evan Chen — Olympiad","Ghi chú và bài giảng nâng cao.","https://web.evanchen.cc/olympiad.html"],
["math","TOÁN · CHUYÊN SÂU","Yufei Zhao","Tổ hợp, lý thuyết đồ thị và Olympic.","https://yufeizhao.com/olympiad/"],
["math","TOÁN · MÔ PHỎNG","GeoGebra","Hình học động và trực quan hóa.","https://www.geogebra.org/"],
["math","TOÁN · ĐẠI HỌC","MIT OpenCourseWare Mathematics","Giải tích, đại số tuyến tính và toán ứng dụng.","https://ocw.mit.edu/search/?d=Mathematics"],
["physics","VẬT LÝ · OLYMPIC","International Physics Olympiad","Thông tin và đề Olympic Vật lý.","https://www.ipho-new.org/"],
["physics","VẬT LÝ · NỀN TẢNG","OpenStax Physics","Giáo trình mở về cơ, sóng và điện từ.","https://openstax.org/subjects/science"],
["physics","VẬT LÝ · THỰC NGHIỆM","PhET","Mô phỏng khoa học tương tác.","https://phet.colorado.edu/vi/"],
["physics","VẬT LÝ · THỰC NGHIỆM","Tracker","Phân tích chuyển động từ video.","https://physlets.org/tracker/"],
["physics","VẬT LÝ · CẢM BIẾN","phyphox","Thí nghiệm bằng cảm biến điện thoại.","https://phyphox.org/"],
["physics","VẬT LÝ · ĐẠI HỌC","MIT OpenCourseWare Physics","Học liệu vật lý chuyên sâu.","https://ocw.mit.edu/search/?d=Physics"],
["general","LIÊN NGÀNH · AI","UNESCO AI Competency Framework","Đạo đức và năng lực sử dụng AI.","https://www.unesco.org/en/articles/ai-competency-framework-students"],
["general","LIÊN NGÀNH · AI","OECD Digital Education Outlook 2026","Bằng chứng về GenAI trong học tập.","https://www.oecd.org/en/publications/oecd-digital-education-outlook-2026_062a7394-en.html"],
["general","LIÊN NGÀNH · TỰ HỌC","Khan Academy","Kiến thức nền tảng và thực hành.","https://www.khanacademy.org/"]];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const subjectGrid=document.getElementById("subjectGrid"),subjectSearch=document.getElementById("subjectSearch");
let subjectFilter="all",resourceFilter="all",course="math",term=0;
function paintSubjects(){const q=subjectSearch.value.toLocaleLowerCase("vi").trim();const list=subjects.filter(s=>(subjectFilter==="all"||s[1]===subjectFilter)&&s.join(" ").toLocaleLowerCase("vi").includes(q));subjectGrid.innerHTML=list.length?list.map(s=>'<article class="subject-card"><div class="subject-top"><span class="subject-symbol">'+esc(s[2])+'</span><span class="subject-category">'+(s[1]==="stem"?"Khoa học tự nhiên":s[1]==="social"?"Khoa học xã hội":"Ngoại ngữ")+'</span></div><h3>Chuyên '+esc(s[0])+'</h3><p>'+esc(s[3])+'</p><div class="subject-bottom">'+esc(s[4])+'</div></article>').join(""):'<p class="empty">Không tìm thấy môn chuyên. Vui lòng thử từ khóa khác.</p>';}
document.querySelectorAll("[data-subject-filter]").forEach(b=>b.addEventListener("click",()=>{subjectFilter=b.dataset.subjectFilter;document.querySelectorAll("[data-subject-filter]").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",String(x===b))});paintSubjects()}));subjectSearch.addEventListener("input",paintSubjects);
function paintCourse(){document.querySelectorAll("[data-course]").forEach(b=>{const a=b.dataset.course===course;b.classList.toggle("active",a);b.setAttribute("aria-selected",String(a))});const terms=course==="math"?math:physics;document.getElementById("semesterList").innerHTML=terms.map((x,i)=>'<button type="button" data-term="'+i+'" class="'+(term===i?"active":"")+'" aria-pressed="'+(term===i)+'"><b>'+(10+Math.floor(i/2))+'</b>Học kỳ '+(i%2+1)+'</button>').join("");const x=terms[term];document.getElementById("pathDetail").innerHTML='<div class="path-detail"><div><div class="detail-label">LỚP '+(10+Math.floor(term/2))+' / HỌC KỲ '+(term%2+1)+'</div><h4>'+esc(x[0])+'</h4><p><strong>Kiến thức:</strong> '+esc(x[1])+'</p><p><strong>Hoạt động:</strong> '+esc(x[2])+'</p></div><div><div class="detail-label">SẢN PHẨM VÀ ĐÁNH GIÁ</div><h4>Minh chứng năng lực</h4><p>'+esc(x[3])+'</p><ul><li>Tự giải thích và thực hiện độc lập</li><li>Kiểm chứng gợi ý từ AI nếu có</li><li>Giải quyết một biến thể mới</li></ul></div></div>';document.querySelectorAll("[data-term]").forEach(b=>b.addEventListener("click",()=>{term=Number(b.dataset.term);paintCourse()}));}
document.querySelectorAll("[data-course]").forEach(b=>b.addEventListener("click",()=>{course=b.dataset.course;term=0;paintCourse()}));
document.getElementById("techGrid").innerHTML=technology.map((x,i)=>'<article class="tech-card"><span class="tech-num">'+String(i+1).padStart(2,"0")+'</span><h3>'+esc(x[0])+'</h3><p>'+esc(x[1])+'</p></article>').join("");
function paintResources(){document.getElementById("resourceGrid").innerHTML=resources.filter(x=>resourceFilter==="all"||x[0]===resourceFilter).map(x=>'<article class="resource-card"><span class="resource-top">'+esc(x[1])+'</span><h3>'+esc(x[2])+'</h3><p>'+esc(x[3])+'</p><a href="'+esc(x[4])+'" target="_blank" rel="noopener noreferrer">Đến nguồn chính thức ↗</a></article>').join("");}
document.querySelectorAll("[data-resource-filter]").forEach(b=>b.addEventListener("click",()=>{resourceFilter=b.dataset.resourceFilter;document.querySelectorAll("[data-resource-filter]").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",String(x===b))});paintResources()}));
const toggle=document.getElementById("menuToggle"),nav=document.getElementById("primaryNav");toggle.addEventListener("click",()=>{const opened=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(opened));toggle.setAttribute("aria-label",opened?"Đóng menu điều hướng":"Mở menu điều hướng")});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false")}));document.addEventListener("keydown",e=>{if(e.key==="Escape"){nav.classList.remove("open");toggle.setAttribute("aria-expanded","false")}});
document.getElementById("siteYear").textContent=String(new Date().getFullYear());
paintSubjects();paintCourse();paintResources();