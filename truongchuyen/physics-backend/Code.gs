/**
 * V-TALENT Physics LMS pilot backend, Google Apps Script V8.
 * No secrets. Do not run with real student data until privacy/consent and validation approved.
 * Paste into a private Apps Script project owned by administrator.
 * Script Properties: BANK_FILE_ID (private Drive JSON, same schema but reviewed private questions),
 * ADMIN_EMAIL (exact account); set up only after deployment checklist.
 */
const HEADERS=['attempt_id','submitted_at','form_id','assessment_id','grade','name','school','email','phone','consent','score','max_score','topic_scores','mail_status','mail_error'];
function config_(){const p=PropertiesService.getScriptProperties();const email=p.getProperty('ADMIN_EMAIL');if(!email)throw new Error('Set ADMIN_EMAIL');return p;}
function requireAdmin_(){const p=config_(),actual=Session.getActiveUser().getEmail();if(!actual||actual.toLowerCase()!==p.getProperty('ADMIN_EMAIL').toLowerCase())throw new Error('Admin only');return p;}
function setupPhysicsPilot(){
 const p=requireAdmin_();if(p.getProperty('SHEET_ID'))throw new Error('Already initialized; avoid duplicate forms/triggers.');
 const bankFile=p.getProperty('BANK_FILE_ID');if(!bankFile)throw new Error('Set private BANK_FILE_ID first.');
 const bank=JSON.parse(DriveApp.getFileById(bankFile).getBlob().getDataAsString());
 const dict=new Map(bank.items.map(q=>[q.id,q]));
 if(!Array.isArray(bank.forms)||bank.forms.length!==10||bank.forms.some(f=>!f.ids.length||f.ids.some(id=>!dict.has(id))))throw new Error('Invalid bank');
 const ss=SpreadsheetApp.create('V-TALENT Physics — PRIVATE assessment pilot');
 const log=ss.getSheets()[0];log.setName('ATTEMPTS');log.appendRow(HEADERS);log.setFrozenRows(1);
 const forms=ss.insertSheet('ASSESSMENTS');forms.appendRow(['assessment_id','grade','type','form_id','student_url','edit_url','status','question_version']);
 const students=ss.insertSheet('STUDENTS');students.appendRow(['student_id','name','school','grade','guardian_contact','status','notes']);
 const classes=ss.insertSheet('CLASSES');classes.appendRow(['class_id','grade','level','teacher','status']);
 const enrol=ss.insertSheet('ENROLLMENTS');enrol.appendRow(['student_id','class_id','start_date','status']);
 const modules=ss.insertSheet('SYLLABUS');modules.appendRow(['module_id','grade','semester','title','version','status']);
 const prog=ss.insertSheet('PROGRESS');prog.appendRow(['student_id','module_id','date','independent_score','lab_score','transfer_score','notes']);
 const admin=ss.insertSheet('README');admin.appendRow(['PRIVATE — Do not share or publish.','Assessment pilot; not admissions or standardized tests.']);
 p.setProperty('SHEET_ID',ss.getId());
 for(const f of bank.forms){
  const form=FormApp.create('V-TALENT Physics — '+f.id+' (pilot)');
  form.setIsQuiz(true).setCollectEmail(true).setDescription('Đánh giá thử nghiệm. Thông tin chỉ dùng cho báo kết quả và quản lý học tập theo thông báo bảo mật đã được đơn vị triển khai phê duyệt. Không dùng riêng điểm này để tuyển sinh. Học sinh chưa thành niên cần có sự đồng ý phù hợp của phụ huynh/người giám hộ. Không gửi dữ liệu nhạy cảm khác.');
  form.setAcceptingResponses(false);
  const names={};names.name=form.addTextItem().setTitle('Họ và tên').setRequired(true).getId();names.school=form.addTextItem().setTitle('Trường').setRequired(true).getId();
  names.phone=form.addTextItem().setTitle('Số điện thoại liên hệ của phụ huynh (không bắt buộc)').setRequired(false).getId();
  names.consent=form.addMultipleChoiceItem().setTitle('Xác nhận đã đọc thông báo bảo mật và có sự đồng ý cần thiết').setChoiceValues(['Tôi xác nhận']).setRequired(true).getId();
  const map={};for(const id of f.ids){const q=dict.get(id);const item=form.addMultipleChoiceItem().setTitle(q.stem).setRequired(true).setPoints(1);item.setChoices(q.options.map((s,i)=>item.createChoice(s,i===q.answer_index)));map[String(item.getId())]={id:q.id,topic:q.topic,answer:q.options[q.answer_index]};}
  p.setProperty('F_'+form.getId(),JSON.stringify({assessment:f.id,grade:f.grade,names,map}));
  ScriptApp.newTrigger('receivePhysicsAttempt').forForm(form).onFormSubmit().create();
  forms.appendRow([f.id,f.grade,f.type,form.getId(),form.getPublishedUrl(),form.getEditUrl(),'CLOSED — manual approval',bank.schema_version]);
 }
 return ss.getUrl();
}
// Installable form-submit trigger, executes as owner. No anonymous web API.
// All user-supplied strings are written as inert spreadsheet text.
function safe_(v){const s=String(v==null?'':v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').slice(0,500);return /^[\s]*[=+\-@]/.test(s)?"'"+s:s;}
function receivePhysicsAttempt(e){
 if(!e||!e.source||!e.response)throw Error('Use form submit trigger');
 const p=config_(),fid=e.source.getId(),meta=JSON.parse(p.getProperty('F_'+fid)||'null');if(!meta)throw Error('Unknown form');
 const response=e.response,id=fid+':'+response.getId(),answers={};
 response.getItemResponses().forEach(r=>answers[String(r.getItem().getId())]=String(r.getResponse()));
 if(answers[meta.names.consent]!=='Tôi xác nhận')return;
 const email=String(response.getRespondentEmail()||'').trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return;
 const topic={};let score=0;Object.entries(meta.map).forEach(([item,q])=>{const ok=answers[item]===q.answer;score+=Number(ok);const t=topic[q.topic]||(topic[q.topic]=[0,0]);t[0]+=Number(ok);t[1]++;});
 const ss=SpreadsheetApp.openById(p.getProperty('SHEET_ID')),sheet=ss.getSheetByName('ATTEMPTS'),lock=LockService.getScriptLock();lock.waitLock(30000);
 let row;try{if(sheet.getLastRow()>1&&sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).findNext())return;sheet.appendRow([id,response.getTimestamp(),fid,meta.assessment,meta.grade,safe_(answers[meta.names.name]),safe_(answers[meta.names.school]),safe_(email),safe_(answers[meta.names.phone]),'affirmed',score,Object.keys(meta.map).length,JSON.stringify(topic),'PENDING','']);row=sheet.getLastRow();SpreadsheetApp.flush();}finally{lock.releaseLock();}
 try{if(MailApp.getRemainingDailyQuota()<1)throw Error('Daily quota exhausted');MailApp.sendEmail({to:email,subject:'V-TALENT Physics – Kết quả tự đánh giá',body:'Bài: '+meta.assessment+'\nSố câu đúng: '+score+'/'+Object.keys(meta.map).length+'\nTheo chủ đề: '+JSON.stringify(topic)+'\nĐây là bài thử nghiệm, không phải điểm chuẩn tuyển sinh.\nLiên hệ đơn vị triển khai nếu cần điều chỉnh hoặc xóa dữ liệu.'});sheet.getRange(row,14,1,2).setValues([['SENT','']]);}catch(err){sheet.getRange(row,14,1,2).setValues([['ERROR',safe_(err.message)]]);}
}
// Admin-only web app. Deploy separately: execute as user accessing, access only owner.
// No personal records served to public. Dashboard links to private Sheet for CRUD.
function doGet(){
 const p=requireAdmin_(),ss=SpreadsheetApp.openById(p.getProperty('SHEET_ID')),s=ss.getSheetByName('ATTEMPTS'),data=s.getDataRange().getValues().slice(1),groups={};let failed=0;
 for(const r of data){const k=String(r[3]);const a=groups[k]||(groups[k]=[0,0]);a[0]++;a[1]+=r[11]?100*r[10]/r[11]:0;if(r[13]!=='SENT')failed++;}
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return HtmlService.createHtmlOutput('<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Physics Admin</title><style>body{font:16px system-ui;max-width:960px;margin:40px auto;padding:20px;color:#15323b}table{width:100%;border-collapse:collapse}td,th{padding:10px;border-bottom:1px solid #dce7df;text-align:left}a{color:#346e66}</style><h1>V-TALENT Physics · Admin</h1><p>Lượt nộp: '+data.length+' · Email chưa gửi thành công: '+failed+'</p><table><tr><th>Bài</th><th>Lượt</th><th>Điểm TB (%)</th></tr>'+Object.entries(groups).map(([k,v])=>'<tr><td>'+esc(k)+'</td><td>'+v[0]+'</td><td>'+(v[1]/v[0]).toFixed(1)+'</td></tr>').join('')+'</table><p><a href="'+esc(ss.getUrl())+'" target="_blank" rel="noopener">Quản lý hồ sơ, lớp, ghi danh, syllabus, tiến độ (Google Sheets riêng tư)</a></p><p>Không công bố dữ liệu cá nhân; quyền truy cập theo tài khoản quản trị.</p></html>');
}
