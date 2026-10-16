import { DocumentTemplate } from '../types/court';

export interface NQ05FormMeta {
  formNumber: string; // e.g. "01-HS"
  code: string;       // e.g. "MAU_01_HS"
  name: string;
  stage: 'Phân công & Chuẩn bị' | 'Tạm giam & Biện pháp ngăn chặn' | 'Phiên tòa & Nghị án' | 'Bản án & Quyết định' | 'Trả hồ sơ & Đình chỉ' | 'Kháng cáo & Phúc thẩm' | 'Giám đốc thẩm & Khởi tố';
  applicableLaw: string;
  description: string;
  signerTitle: string;
  decisionTitle: string;
  specificArticlesHtml: string;
}

export const NQ05_FORMS_CATALOG: NQ05FormMeta[] = [
  // 1. Phân công & Thủ tục chuẩn bị
  {
    formNumber: '01-HS',
    code: 'MAU_01_HS',
    name: 'Quyết định phân công Phó Chánh án, Thẩm phán, Hội thẩm giải quyết vụ án',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 44, Điều 45 và Điều 288 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định của Chánh án phân công Thẩm phán chủ tọa, Thẩm phán dự khuyết, Hội thẩm và Hội thẩm dự khuyết.',
    signerTitle: 'CHÁNH ÁN',
    decisionTitle: 'QUYẾT ĐỊNH PHÂN CÔNG PHÓ CHÁNH ÁN, THẨM PHÁN, HỘI THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Phân công Thẩm phán: <strong>{{THAM_PHAN}}</strong> ({{NGACH_THAM_PHAN}}) làm chủ tọa phiên tòa giải quyết vụ án. Thẩm phán dự khuyết: {{THAM_PHAN_DU_KHUYET}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Thành phần Hội thẩm nhân dân tham gia Hội đồng xét xử:</p>
      <div style="margin-left: 35px; margin-bottom: 8px;">{{HOI_THAM_NHAN_DAN}}</div>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Các Thẩm phán và Hội thẩm nhân dân có trách nhiệm thực hiện đầy đủ quyền hạn, nhiệm vụ theo quy định của BLTTHS.</p>
    `
  },
  {
    formNumber: '02-HS',
    code: 'MAU_02_HS',
    name: 'Quyết định phân công Thư ký Tòa án tiến hành tố tụng đối với vụ án hình sự',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 44 và Điều 47 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định của Chánh án phân công Thư ký phiên tòa và Thư ký dự khuyết hoặc Thẩm tra viên thẩm tra hồ sơ.',
    signerTitle: 'CHÁNH ÁN',
    decisionTitle: 'QUYẾT ĐỊNH PHÂN CÔNG THƯ KÝ TÒA ÁN TIẾN HÀNH TỐ TỤNG',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Phân công Thư ký Tòa án: <strong>{{THU_KY}}</strong> tiến hành các hoạt động tố tụng, ghi biên bản phiên tòa đối với vụ án {{TEN_VU_AN}} (Số thụ lý: {{SO_THU_LY}}).</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Thư ký dự khuyết: {{THU_KY_DU_KHUYET}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thư ký Tòa án có trách nhiệm quản lý hồ sơ, tống đạt văn bản và thực hiện nhiệm vụ quy định tại Điều 47 BLTTHS.</p>
    `
  },
  {
    formNumber: '03-HS',
    code: 'MAU_03_HS',
    name: 'Quyết định thay đổi Thẩm phán, Hội thẩm, Thư ký Tòa án trước khi mở phiên tòa',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Các điều 44, 45, 47, 51, 52, 53, 54 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định của Chánh án thay đổi người tiến hành tố tụng khi thuộc trường hợp phải từ chối hoặc bị thay đổi.',
    signerTitle: 'CHÁNH ÁN',
    decisionTitle: 'QUYẾT ĐỊNH THAY ĐỔI NGƯỜI TIẾN HÀNH TỐ TỤNG TRƯỚC PHIÊN TÒA',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Thay đổi người tiến hành tố tụng trong vụ án: {{TEN_VU_AN}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Phân công Thẩm phán / Thư ký mới thay thế: <strong>{{THAM_PHAN}}</strong>.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Quyết định này có hiệu lực kể từ ngày ký và được gửi cho Viện kiểm sát cùng cấp, các bị cáo và đương sự.</p>
    `
  },

  // 2. Tạm giam & Biện pháp ngăn chặn (Mẫu 04-HS đến 12-HS, 46-HS)
  {
    formNumber: '04-HS',
    code: 'MAU_04_HS',
    name: 'Quyết định tạm giam (giai đoạn chuẩn bị xét xử sơ thẩm đối với bị can, bị cáo đang bị tạm giam)',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 44, Điều 119 và Điều 278 Bộ luật Tố tụng hình sự 2015',
    description: 'Áp dụng cho Chánh án/Thẩm phán chủ tọa tiếp tục tạm giam bị cáo đang bị tạm giam để chuẩn bị xét xử.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA / CHÁNH ÁN',
    decisionTitle: 'QUYẾT ĐỊNH TẠM GIAM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Tiếp tục tạm giam đối với bị can/bị cáo:</p>
      <div style="margin-left: 30px; margin-bottom: 8px;">{{BI_CAN_BI_CAO}}</div>
      <p style="text-indent: 25px; margin: 6px 0;">Bị Viện kiểm sát truy tố về tội danh: <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong>.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời hạn tạm giam là: <strong>{{THOI_HAN_TAM_GIAM}}</strong>, kể từ ngày hết hạn của lệnh trước đến ngày <strong>{{NGAY_HET_HAN_TAM_GIAM}}</strong>.</p>
      <p style="text-indent: 25px; margin: 6px 0;">Nơi tạm giam: Trại tạm giam Công an có thẩm quyền.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 3.</strong> Cơ quan quản lý tạm giữ, tạm giam và bị can/bị cáo chịu trách nhiệm thi hành Quyết định này.</p>
    `
  },
  {
    formNumber: '05-HS',
    code: 'MAU_05_HS',
    name: 'Quyết định tạm giam (cho đến khi kết thúc phiên tòa sơ thẩm đối với bị cáo đang bị tạm giam)',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 278 và Điều 329 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định tạm giam bị cáo từ khi mở phiên tòa cho đến khi kết thúc phiên tòa sơ thẩm.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH TẠM GIAM ĐẾN KHI KẾT THÚC PHIÊN TÒA SƠ THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Quyết định tạm giam cho đến khi kết thúc phiên tòa sơ thẩm đối với bị cáo:</p>
      <div style="margin-left: 30px; margin-bottom: 8px;">{{BI_CAN_BI_CAO}}</div>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời hạn tạm giam tính từ ngày mở phiên tòa cho đến khi Hội đồng xét xử tuyên án kết thúc phiên tòa.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 3.</strong> Trại tạm giam Công an có trách nhiệm trích xuất và bảo đảm áp giải bị cáo đến phiên tòa đúng thời gian quy định.</p>
    `
  },
  {
    formNumber: '06-HS',
    code: 'MAU_06_HS',
    name: 'Quyết định bắt, tạm giam (giai đoạn chuẩn bị xét xử sơ thẩm đối với bị can, bị cáo đang tại ngoại)',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 44, Điều 113, Điều 119 và Điều 278 Bộ luật Tố tụng hình sự 2015',
    description: 'Áp dụng bắt tạm giam khi bị can, bị cáo tại ngoại có dấu hiệu bỏ trốn, cản trở điều tra, chuẩn bị xét xử.',
    signerTitle: 'CHÁNH ÁN / THẨM PHÁN CHỦ TỌA',
    decisionTitle: 'QUYẾT ĐỊNH BẮT, TẠM GIAM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Bắt và tạm giam đối với bị can / bị cáo đang được tại ngoại:</p>
      <div style="margin-left: 30px; margin-bottom: 8px;">{{BI_CAN_BI_CAO}}</div>
      <p style="text-indent: 25px; margin: 6px 0;">Tội danh bị truy tố: <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong>.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời hạn tạm giam là: <strong>{{THOI_HAN_TAM_GIAM}}</strong>, kể từ ngày bắt bị can/bị cáo.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 3.</strong> Cơ quan Cảnh sát điều tra, Cơ quan thi hành án hình sự Công an có trách nhiệm tổ chức thi hành việc bắt và tạm giam theo đúng luật định.</p>
    `
  },
  {
    formNumber: '07-HS',
    code: 'MAU_07_HS',
    name: 'Quyết định tạm giam (áp dụng tại hoặc khi kết thúc phiên tòa sơ thẩm đối với bị cáo đang bị tạm giam)',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 278 và Điều 329 Bộ luật Tố tụng hình sự 2015',
    description: 'Tạm giam bị cáo sau khi tuyên án tù để bảo đảm thi hành án hình sự và kháng cáo, kháng nghị.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ SƠ THẨM / THẨM PHÁN CHỦ TỌA',
    decisionTitle: 'QUYẾT ĐỊNH TẠM GIAM SAU KHI KẾT THÚC PHIÊN TÒA SƠ THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Tạm giam bị cáo sau khi kết thúc phiên tòa sơ thẩm đối với: <strong>{{BI_CAN_BI_CAO}}</strong></p>
      <p style="text-indent: 25px; margin: 6px 0;">Đã bị kết án phạt tù theo Bản án hình sự sơ thẩm cùng ngày.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời hạn tạm giam là <strong>45 (bốn mươi lăm) ngày</strong> kể từ ngày tuyên án để bảo đảm việc kháng cáo, kháng nghị và thi hành án.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 3.</strong> Giao Trại tạm giam Công an thi hành việc tiếp tục tạm giam bị cáo.</p>
    `
  },
  {
    formNumber: '08-HS',
    code: 'MAU_08_HS',
    name: 'Quyết định bắt, tạm giam (áp dụng khi kết thúc phiên tòa sơ thẩm đối với bị cáo đang tại ngoại)',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 113, Điều 119 và Điều 329 Bộ luật Tố tụng hình sự 2015',
    description: 'Bắt tạm giam ngay tại phiên tòa đối với bị cáo tại ngoại bị tuyên án tù trên 03 năm hoặc có nguy cơ bỏ trốn.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ / THẨM PHÁN CHỦ TỌA',
    decisionTitle: 'QUYẾT ĐỊNH BẮT, TẠM GIAM TẠI PHIÊN TÒA SƠ THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Bắt tạm giam ngay sau khi tuyên án đối với bị cáo đang tại ngoại: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời hạn tạm giam là <strong>45 ngày</strong> kể từ ngày bắt để bảo đảm thi hành án.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 3.</strong> Lực lượng Cảnh sát bảo vệ phiên tòa và Trại tạm giam thi hành lệnh bắt giam ngay lập tức.</p>
    `
  },
  {
    formNumber: '09-HS',
    code: 'MAU_09_HS',
    name: 'Quyết định tạm giam (giai đoạn chuẩn bị xét xử phúc thẩm đối với bị cáo đang bị tạm giam)',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 44, Điều 119 và Điều 347 Bộ luật Tố tụng hình sự 2015',
    description: 'Áp dụng cho Tòa án cấp phúc thẩm tiếp tục tạm giam bị cáo để chuẩn bị mở phiên tòa phúc thẩm.',
    signerTitle: 'CHÁNH ÁN / THẨM PHÁN CHỦ TỌA PHÚC THẨM',
    decisionTitle: 'QUYẾT ĐỊNH TẠM GIAM GIAI ĐOẠN CHUẨN BỊ XÉT XỬ PHÚC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Tiếp tục tạm giam bị cáo kháng cáo / bị kháng nghị: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời hạn tạm giam: theo quy định tại Điều 347 BLTTHS phục vụ xét xử phúc thẩm.</p>
    `
  },
  {
    formNumber: '10-HS',
    code: 'MAU_10_HS',
    name: 'Quyết định bắt, tạm giam (giai đoạn chuẩn bị xét xử phúc thẩm đối với bị cáo đang tại ngoại)',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 44, Điều 113, 119 và Điều 347 Bộ luật Tố tụng hình sự 2015',
    description: 'Bắt tạm giam bị cáo tại ngoại trong giai đoạn chuẩn bị xét xử phúc thẩm.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN CẤP PHÚC THẨM',
    decisionTitle: 'QUYẾT ĐỊNH BẮT, TẠM GIAM CHUẨN BỊ XÉT XỬ PHÚC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Bắt tạm giam bị cáo: {{BI_CAN_BI_CAO}} đang được tại ngoại để phục vụ xét xử phúc thẩm.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Giao Cơ quan Công an có thẩm quyền tổ chức áp giải, đưa vào Trại tạm giam.</p>
    `
  },
  {
    formNumber: '11-HS',
    code: 'MAU_11_HS',
    name: 'Quyết định tạm giam (áp dụng tại hoặc kết thúc phiên tòa phúc thẩm đối với bị cáo đang bị tạm giam)',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 347 Bộ luật Tố tụng hình sự 2015',
    description: 'Tạm giam bị cáo sau phiên tòa phúc thẩm y án tù để bảo đảm chuyển giao thi hành án.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ PHÚC THẨM',
    decisionTitle: 'QUYẾT ĐỊNH TẠM GIAM SAU PHIÊN TÒA PHÚC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Tạm giam bị cáo: {{BI_CAN_BI_CAO}} sau khi tuyên Bản án phúc thẩm.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời hạn tạm giam là 30 ngày để chuyển giao hồ sơ thi hành án phạt tù.</p>
    `
  },
  {
    formNumber: '12-HS',
    code: 'MAU_12_HS',
    name: 'Quyết định bắt, tạm giam (áp dụng khi kết thúc phiên tòa phúc thẩm đối với bị cáo đang tại ngoại)',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 113, 119 và Điều 347 Bộ luật Tố tụng hình sự 2015',
    description: 'Bắt tạm giam bị cáo tại ngoại sau khi cấp phúc thẩm sửa án tuyên phạt tù giam.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ PHÚC THẨM',
    decisionTitle: 'QUYẾT ĐỊNH BẮT TẠM GIAM SAU PHIÊN TÒA PHÚC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Bắt tạm giam đối với bị cáo: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời hạn tạm giam là 45 ngày để bảo đảm thi hành án hình sự.</p>
    `
  },
  {
    formNumber: '13-HS',
    code: 'MAU_13_HS',
    name: 'Thông báo về việc người bào chữa tham gia tố tụng',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 78 Bộ luật Tố tụng hình sự 2015',
    description: 'Văn bản của Tòa án thông báo đăng ký người bào chữa (Luật sư / Trợ giúp viên pháp lý) hợp lệ.',
    signerTitle: 'THẨM PHÁN ĐƯỢC PHÂN CÔNG GIẢI QUYẾT VỤ ÁN',
    decisionTitle: 'THÔNG BÁO VỀ VIỆC NGƯỜI BÀO CHỮA THAM GIA TỐ TỤNG',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Tòa án nhân dân thông báo đã vào Sổ đăng ký người bào chữa đối với:</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Luật sư / Trợ giúp viên pháp lý tham gia bào chữa cho bị can, bị cáo: <strong>{{BI_CAN_BI_CAO}}</strong> trong vụ án {{TEN_VU_AN}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Người bào chữa được thực hiện các quyền và nghĩa vụ quy định tại Điều 73 và Điều 78 BLTTHS 2015.</p>
    `
  },
  {
    formNumber: '14-HS',
    code: 'MAU_14_HS',
    name: 'Quyết định áp dụng biện pháp bắt buộc chữa bệnh',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 44 và Điều 447 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định của Chánh án đưa bị can, bị cáo đi cơ sở chữa bệnh tâm thần theo kết luận giám định pháp y.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN NHÂN DÂN',
    decisionTitle: 'QUYẾT ĐỊNH ÁP DỤNG BIỆN PHÁP BẮT BUỘC CHỮA BỆNH',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Áp dụng biện pháp bắt buộc chữa bệnh đối với bị can / bị cáo: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">Nơi chữa bệnh: Viện Pháp y tâm thần Trung ương hoặc cơ sở y tế chuyên khoa chuyên trách.</p>
    `
  },
  {
    formNumber: '15-HS',
    code: 'MAU_15_HS',
    name: 'Quyết định đình chỉ biện pháp bắt buộc chữa bệnh',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 449 Bộ luật Tố tụng hình sự 2015',
    description: 'Đình chỉ chữa bệnh khi người bị bắt buộc chữa bệnh đã khỏi bệnh để phục hồi tố tụng.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN NHÂN DÂN',
    decisionTitle: 'QUYẾT ĐỊNH ĐÌNH CHỈ BIỆN PHÁP BẮT BUỘC CHỮA BỆNH',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Đình chỉ biện pháp bắt buộc chữa bệnh đối với: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Phục hồi việc tiến hành tố tụng giải quyết vụ án theo thủ tục chung.</p>
    `
  },

  // 3. Thủ tục rút gọn & Trưng cầu giám định (Mẫu 16-HS đến 19-HS)
  {
    formNumber: '16-HS',
    code: 'MAU_16_HS',
    name: 'Quyết định áp dụng thủ tục rút gọn',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 458 Bộ luật Tố tụng hình sự 2015',
    description: 'Áp dụng thủ tục rút gọn với vụ án ít nghiêm trọng, chứng cứ rõ ràng, phạm tội quả tang.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH ÁP DỤNG THỦ TỤC RÚT GỌN',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Áp dụng thủ tục rút gọn để giải quyết vụ án đối với bị cáo: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời hạn chuẩn bị xét xử và trình tự phiên tòa được tiến hành theo Chương XXXI BLTTHS.</p>
    `
  },
  {
    formNumber: '17-HS',
    code: 'MAU_17_HS',
    name: 'Quyết định hủy bỏ Quyết định áp dụng thủ tục rút gọn',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 459 Bộ luật Tố tụng hình sự 2015',
    description: 'Chuyển về thủ tục chung khi xuất hiện tình tiết mới hoặc tội phạm phức tạp hơn.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH HỦY BỎ THỦ TỤC RÚT GỌN',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Hủy bỏ Quyết định áp dụng thủ tục rút gọn đối với vụ án {{TEN_VU_AN}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Chuyển vụ án sang giải quyết theo thủ tục tố tụng hình sự thông thường.</p>
    `
  },
  {
    formNumber: '18-HS',
    code: 'MAU_18_HS',
    name: 'Quyết định trưng cầu giám định (theo yêu cầu của người tham gia tố tụng)',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 205 Bộ luật Tố tụng hình sự 2015',
    description: 'Trưng cầu cơ quan chuyên môn giám định tâm thần, ADN, tài sản, tỷ lệ thương tích theo đề nghị.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH TRƯNG CẦU GIÁM ĐỊNH',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Trưng cầu tổ chức giám định tư pháp thực hiện giám định theo nội dung yêu cầu trong vụ án {{TEN_VU_AN}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Cơ quan giám định có trách nhiệm gửi kết luận giám định đúng thời hạn quy định.</p>
    `
  },
  {
    formNumber: '19-HS',
    code: 'MAU_19_HS',
    name: 'Quyết định trưng cầu giám định (khi xét thấy cần thiết)',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 205 Bộ luật Tố tụng hình sự 2015',
    description: 'Thẩm phán chủ động trưng cầu giám định khi phát hiện có mâu thuẫn hoặc chưa rõ trong hồ sơ.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH TRƯNG CẦU GIÁM ĐỊNH TƯ PHÁP',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Trưng cầu giám định tư pháp để làm rõ các tình tiết khách quan của vụ án.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Tạm dừng các hoạt động chuẩn bị xét xử cần chờ kết quả giám định theo quy định.</p>
    `
  },

  // 4. Quyết định đưa vụ án ra xét xử & Hoãn phiên tòa (Mẫu 20-HS, 21-HS, 42-HS, 43-HS, 44-HS)
  {
    formNumber: '20-HS',
    code: 'MAU_20_HS',
    name: 'Quyết định đưa vụ án ra xét xử sơ thẩm',
    stage: 'Phiên tòa & Nghị án',
    applicableLaw: 'Điều 255 và Điều 277 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định ấn định ngày giờ, địa điểm mở phiên tòa hình sự sơ thẩm công khai hoặc xử kín.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH ĐƯA VỤ ÁN RA XÉT XỬ SƠ THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>I. Đưa ra xét xử sơ thẩm vụ án hình sự đối với các bị cáo:</strong></p>
      <div style="margin-left: 30px; margin-bottom: 8px;">{{BI_CAN_BI_CAO}}</div>
      <p style="text-indent: 25px; margin: 6px 0;">Bị Viện kiểm sát truy tố về tội: <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong> theo Cáo trạng: {{CAN_CU_PHAP_LY}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>II. Thời gian mở phiên tòa:</strong> Hồi 08 giờ 00 phút ngày {{NGAY_BAN_HANH}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Địa điểm mở phiên tòa:</strong> Trụ sở Tòa án nhân dân: {{DIA_CHI_TOA_AN}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>III. Thành phần tiến hành tố tụng:</strong></p>
      <div style="margin-left: 30px; margin-bottom: 8px;">
        <div>- Thẩm phán - Chủ tọa phiên tòa: <strong>{{THAM_PHAN}}</strong></div>
        <div>- Các Hội thẩm nhân dân:</div>
        <div style="margin-left: 15px;">{{HOI_THAM_NHAN_DAN}}</div>
        <div>- Thư ký phiên tòa: <strong>{{THU_KY}}</strong></div>
        <div>- Kiểm sát viên Viện kiểm sát nhân dân cùng cấp thực hành quyền công tố tại phiên tòa.</div>
      </div>
    `
  },
  {
    formNumber: '21-HS',
    code: 'MAU_21_HS',
    name: 'Quyết định đưa vụ án ra xét xử phúc thẩm',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 346 và Điều 350 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định mở phiên tòa hình sự phúc thẩm theo kháng cáo, kháng nghị.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA PHÚC THẨM',
    decisionTitle: 'QUYẾT ĐỊNH ĐƯA VỤ ÁN RA XÉT XỬ PHÚC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>I. Đưa ra xét xử phúc thẩm công khai vụ án đối với bị cáo có kháng cáo / bị kháng nghị:</strong> {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>II. Thời gian mở phiên tòa:</strong> Hồi 08 giờ 30 phút ngày {{NGAY_BAN_HANH}} tại Phòng xử án phúc thẩm.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>III. Hội đồng xét xử phúc thẩm gồm:</strong> 03 Thẩm phán chuyên trách theo quyết định phân công.</p>
    `
  },
  {
    formNumber: '22-HS',
    code: 'MAU_22_HS',
    name: 'Biên bản phiên tòa hình sự sơ thẩm',
    stage: 'Phiên tòa & Nghị án',
    applicableLaw: 'Điều 258 Bộ luật Tố tụng hình sự 2015',
    description: 'Mẫu chuẩn biên bản diễn biến phiên tòa sơ thẩm ghi nhận toàn bộ lời khai, tranh tụng và thủ tục.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA & THƯ KÝ PHIÊN TÒA',
    decisionTitle: 'BIÊN BẢN PHIÊN TÒA HÌNH SỰ SƠ THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Phiên tòa khai mạc hồi 08 giờ 00 phút ngày {{NGAY_BAN_HANH}} tại trụ sở {{TEN_TOA_AN}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>1. Phần thủ tục bắt đầu phiên tòa:</strong> Thẩm phán chủ tọa kiểm tra căn cước bị cáo {{BI_CAN_BI_CAO}}, phổ biến quyền và nghĩa vụ.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>2. Phần tranh tụng:</strong> Kiểm sát viên công bố cáo trạng, Hội đồng xét xử xét hỏi, đại diện VKS luận tội, người bào chữa và bị cáo tranh luận.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>3. Lời nói sau cùng của bị cáo và Hội đồng xét xử vào phòng nghị án.</strong></p>
    `
  },
  {
    formNumber: '23-HS',
    code: 'MAU_23_HS',
    name: 'Biên bản phiên tòa hình sự phúc thẩm',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 258 và Điều 354 Bộ luật Tố tụng hình sự 2015',
    description: 'Biên bản phiên tòa cấp phúc thẩm ghi nhận nội dung xét hỏi và tranh luận về kháng cáo, kháng nghị.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA & THƯ KÝ PHIÊN TÒA',
    decisionTitle: 'BIÊN BẢN PHIÊN TÒA HÌNH SỰ PHÚC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Phiên tòa phúc thẩm giải quyết kháng cáo/kháng nghị đối với Bản án sơ thẩm vụ án {{TEN_VU_AN}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">Ghi nhận chi tiết lời trình bày của người kháng cáo, quan điểm của Kiểm sát viên và tranh tụng tại phiên tòa.</p>
    `
  },
  {
    formNumber: '24-HS',
    code: 'MAU_24_HS',
    name: 'Biên bản phiên tòa hình sự sơ thẩm theo thủ tục rút gọn',
    stage: 'Phiên tòa & Nghị án',
    applicableLaw: 'Điều 461 Bộ luật Tố tụng hình sự 2015',
    description: 'Biên bản phiên tòa áp dụng thủ tục rút gọn do Thẩm phán tiến hành xét xử độc lập.',
    signerTitle: 'THẨM PHÁN XÉT XỬ & THƯ KÝ PHIÊN TÒA',
    decisionTitle: 'BIÊN BẢN PHIÊN TÒA THỦ TỤC RÚT GỌN',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Biên bản xét xử sơ thẩm theo thủ tục rút gọn do Thẩm phán <strong>{{THAM_PHAN}}</strong> tiến hành.</p>
      <p style="text-indent: 25px; margin: 6px 0;">Trình tự rút gọn: Thẩm phán tóm tắt vụ án, bị cáo nhận tội, Kiểm sát viên đề nghị mức án và tuyên án.</p>
    `
  },
  {
    formNumber: '25-HS',
    code: 'MAU_25_HS',
    name: 'Biên bản nghị án hình sự sơ thẩm',
    stage: 'Phiên tòa & Nghị án',
    applicableLaw: 'Điều 326 Bộ luật Tố tụng hình sự 2015',
    description: 'Biên bản bắt buộc ghi nhận thảo luận kín và biểu quyết của các thành viên HĐXX về tội danh, điều luật và mức án.',
    signerTitle: 'TẤT CẢ CÁC THÀNH VIÊN HỘI ĐỒNG XÉT XỬ KÝ TÊN',
    decisionTitle: 'BIÊN BẢN NGHỊ ÁN SƠ THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Hồi 10 giờ 30 phút ngày {{NGAY_BAN_HANH}}, Hội đồng xét xử sơ thẩm tiến hành nghị án tại phòng nghị án riêng.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Nội dung thảo luận và biểu quyết:</strong></p>
      <p style="text-indent: 25px; margin: 6px 0;">1. Về tính hợp pháp của các hành vi, quyết định tố tụng: 100% biểu quyết hợp pháp.</p>
      <p style="text-indent: 25px; margin: 6px 0;">2. Về tội danh: Biểu quyết khẳng định bị cáo {{BI_CAN_BI_CAO}} phạm tội <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong>.</p>
      <p style="text-indent: 25px; margin: 6px 0;">3. Về hình phạt và các biện pháp tư pháp: Hội đồng xét xử thống nhất quyết định mức hình phạt tương xứng.</p>
    `
  },
  {
    formNumber: '26-HS',
    code: 'MAU_26_HS',
    name: 'Biên bản nghị án hình sự phúc thẩm',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 326 và Điều 354 Bộ luật Tố tụng hình sự 2015',
    description: 'Biên bản nghị án của 03 Thẩm phán cấp phúc thẩm về việc chấp nhận hay bác kháng cáo, kháng nghị.',
    signerTitle: 'CÁC THẨM PHÁN HỘI ĐỒNG XÉT XỬ PHÚC THẨM KÝ TÊN',
    decisionTitle: 'BIÊN BẢN NGHỊ ÁN PHÚC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Hội đồng xét xử phúc thẩm thảo luận, biểu quyết về nội dung kháng cáo, kháng nghị đối với bản án sơ thẩm vụ án {{TEN_VU_AN}}.</p>
    `
  },
  {
    formNumber: '27-HS',
    code: 'MAU_27_HS',
    name: 'Bản án hình sự sơ thẩm (Chuẩn Mẫu số 27-HS TANDTC)',
    stage: 'Bản án & Quyết định',
    applicableLaw: 'Điều 260 Bộ luật Tố tụng hình sự 2015',
    description: 'Bản án hình sự sơ thẩm chính thức nhân danh Nước CHXHCN Việt Nam tuyên tội danh, điều luật và mức án phạt.',
    signerTitle: 'THAY MẶT HỘI ĐỒNG XÉT XỬ SƠ THẨM - THẨM PHÁN CHỦ TỌA',
    decisionTitle: 'BẢN ÁN HÌNH SỰ SƠ THẨM',
    specificArticlesHtml: `
      <div style="text-align: center; font-weight: bold; margin: 10px 0;">NHÂN DANH NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
      <p style="text-indent: 25px; margin: 6px 0;">Ngày {{NGAY_BAN_HANH}}, tại trụ sở Tòa án nhân dân, xét xử sơ thẩm công khai vụ án hình sự đối với bị cáo:</p>
      <div style="margin-left: 30px; margin-bottom: 8px;">{{BI_CAN_BI_CAO}}</div>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>NHẬN ĐỊNH CỦA TÒA ÁN:</strong> Căn cứ vào các chứng cứ và tài liệu đã được thẩm tra tại phiên tòa; căn cứ vào kết quả tranh tụng tại phiên tòa trên cơ sở xem xét đầy đủ, toàn diện chứng cứ, ý kiến của Kiểm sát viên, bị cáo và người bào chữa.</p>
      <div style="text-align: center; font-weight: bold; margin: 10px 0;">QUYẾT ĐỊNH:</div>
      <p style="text-indent: 25px; margin: 6px 0;">Tuyên bố bị cáo phạm tội <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong>.</p>
      <p style="text-indent: 25px; margin: 6px 0;">Áp dụng các điều luật của Bộ luật Hình sự: Xử phạt bị cáo mức án theo quy định của pháp luật.</p>
      <p style="text-indent: 25px; margin: 6px 0;">Về quyền kháng cáo: Bị cáo, người bị hại có quyền kháng cáo bản án trong thời hạn 15 ngày kể từ ngày tuyên án sơ thẩm.</p>
    `
  },
  {
    formNumber: '28-HS',
    code: 'MAU_28_HS',
    name: 'Bản án hình sự phúc thẩm',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 355 Bộ luật Tố tụng hình sự 2015',
    description: 'Bản án phúc thẩm có hiệu lực pháp luật ngay kể từ ngày tuyên án.',
    signerTitle: 'THAY MẶT HĐXX PHÚC THẨM - THẨM PHÁN CHỦ TỌA',
    decisionTitle: 'BẢN ÁN HÌNH SỰ PHÚC THẨM',
    specificArticlesHtml: `
      <div style="text-align: center; font-weight: bold; margin: 10px 0;">NHÂN DANH NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
      <p style="text-indent: 25px; margin: 6px 0;">Căn cứ Điều 355, 356, 357 BLTTHS 2015: Quyết định không chấp nhận / chấp nhận một phần kháng cáo; sửa đổi hoặc giữ nguyên bản án sơ thẩm.</p>
      <p style="text-indent: 25px; margin: 6px 0;">Bản án phúc thẩm có hiệu lực pháp luật kể từ ngày tuyên án./.</p>
    `
  },
  {
    formNumber: '29-HS',
    code: 'MAU_29_HS',
    name: 'Thông báo sửa chữa, bổ sung bản án, quyết định',
    stage: 'Bản án & Quyết định',
    applicableLaw: 'Điều 261 Bộ luật Tố tụng hình sự 2015',
    description: 'Sửa lỗi chính tả, nhầm lẫn số liệu rõ ràng trong bản án hoặc quyết định mà không làm thay đổi bản chất vụ án.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'THÔNG BÁO SỬA CHỮA, BỔ SUNG BẢN ÁN',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Thẩm phán chủ tọa thông báo đính chính sai sót kỹ thuật / số liệu trong Bản án sơ thẩm vụ án {{TEN_VU_AN}}.</p>
    `
  },

  // 5. Trả hồ sơ, Tạm đình chỉ, Đình chỉ, Phục hồi (Mẫu 30-HS đến 41-HS)
  {
    formNumber: '30-HS',
    code: 'MAU_30_HS',
    name: 'Quyết định trả hồ sơ vụ án (không thuộc thẩm quyền giải quyết)',
    stage: 'Trả hồ sơ & Đình chỉ',
    applicableLaw: 'Điều 44 và Điều 274 Bộ luật Tố tụng hình sự 2015',
    description: 'Chánh án quyết định trả hồ sơ vụ án cho VKS khi phát hiện vụ án không thuộc thẩm quyền xét xử của Tòa án mình.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN NHÂN DÂN',
    decisionTitle: 'QUYẾT ĐỊNH TRẢ HỒ SƠ VỤ ÁN HÌNH SỰ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Trả hồ sơ vụ án hình sự thụ lý số: <strong>{{SO_THU_LY}}</strong> cho Viện kiểm sát nhân dân cùng cấp để chuyển đến Tòa án có thẩm quyền xét xử theo luật định.</p>
    `
  },
  {
    formNumber: '31-HS',
    code: 'MAU_31_HS',
    name: 'Biên bản giao nhận hồ sơ vụ án và bản cáo trạng',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 276 Bộ luật Tố tụng hình sự 2015',
    description: 'Biên bản pháp lý giữa Viện kiểm sát và Tòa án khi bàn giao hồ sơ vụ án và bản cáo trạng truy tố.',
    signerTitle: 'ĐẠI DIỆN VKS GIAO & CÁN BỘ TÒA ÁN NHẬN',
    decisionTitle: 'BIÊN BẢN GIAO NHẬN HỒ SƠ VỤ ÁN HÌNH SỰ VÀ BẢN CÁO TRẠNG',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Hôm nay, ngày {{NGAY_THU_LY}}, tại trụ sở Tòa án nhân dân, hai bên tiến hành bàn giao hồ sơ vụ án {{TEN_VU_AN}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Kèm theo Cáo trạng số: {{CAN_CU_PHAP_LY}} và toàn bộ tập hồ sơ chứng cứ, vật chứng liên quan.</p>
    `
  },
  {
    formNumber: '32-HS',
    code: 'MAU_32_HS',
    name: 'Thông báo về việc giải quyết yêu cầu, đề nghị trước khi mở phiên tòa',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 279 Bộ luật Tố tụng hình sự 2015',
    description: 'Thông báo trả lời đơn khiếu nại, yêu cầu triệu tập nhân chứng, thu thập chứng cứ trước phiên tòa.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'THÔNG BÁO GIẢI QUYẾT YÊU CẦU TRƯỚC PHIÊN TÒA',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Tòa án nhân dân thông báo kết quả xem xét đơn yêu cầu, đề nghị của đương sự/người bào chữa trong vụ án {{TEN_VU_AN}}.</p>
    `
  },
  {
    formNumber: '33-HS',
    code: 'MAU_33_HS',
    name: 'Quyết định trả hồ sơ để điều tra bổ sung (Thẩm phán chủ tọa phiên tòa)',
    stage: 'Trả hồ sơ & Đình chỉ',
    applicableLaw: 'Điều 44 và Điều 280 Bộ luật Tố tụng hình sự 2015',
    description: 'Thẩm phán chủ tọa ra quyết định trả hồ sơ cho VKS khi thiếu chứng cứ quan trọng hoặc có dấu hiệu tội phạm khác.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH TRẢ HỒ SƠ ĐỂ ĐIỀU TRA BỔ SUNG',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Trả hồ sơ vụ án số <strong>{{SO_THU_LY}}</strong> cho Viện kiểm sát nhân dân cùng cấp để điều tra bổ sung những vấn đề sau:</p>
      <p style="text-indent: 25px; margin: 6px 0;">1. Thu thập bổ sung các chứng cứ chứng minh hành vi phạm tội của bị can, bị cáo theo quy định;</p>
      <p style="text-indent: 25px; margin: 6px 0;">2. Làm rõ vai trò đồng phạm và trách nhiệm bồi thường dân sự đối với người bị hại.</p>
    `
  },
  {
    formNumber: '34-HS',
    code: 'MAU_34_HS',
    name: 'Quyết định trả hồ sơ để điều tra bổ sung (Hội đồng xét xử sơ thẩm)',
    stage: 'Trả hồ sơ & Đình chỉ',
    applicableLaw: 'Điều 299 Bộ luật Tố tụng hình sự 2015',
    description: 'HĐXX ra quyết định trả hồ sơ điều tra bổ sung ngay tại phiên tòa xét xử sơ thẩm.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ SƠ THẨM',
    decisionTitle: 'QUYẾT ĐỊNH TRẢ HỒ SƠ ĐIỀU TRA BỔ SUNG TẠI PHIÊN TÒA',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Hội đồng xét xử sơ thẩm quyết định trả hồ sơ vụ án hình sự đối với {{BI_CAN_BI_CAO}} cho Viện kiểm sát để điều tra bổ sung theo Điều 299 BLTTHS.</p>
    `
  },
  {
    formNumber: '35-HS',
    code: 'MAU_35_HS',
    name: 'Thông báo yêu cầu bổ sung tài liệu, chứng cứ',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 284 Bộ luật Tố tụng hình sự 2015',
    description: 'Thẩm phán yêu cầu cơ quan điều tra, VKS hoặc đương sự cung cấp bổ sung tài liệu cần thiết.',
    signerTitle: 'THẨM PHÁN ĐƯỢC PHÂN CÔNG GIẢI QUYẾT VỤ ÁN',
    decisionTitle: 'THÔNG BÁO YÊU CẦU BỔ SUNG CHỨNG CỨ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Yêu cầu cung cấp, bổ sung tài liệu chứng cứ cần thiết để phục vụ giải quyết vụ án {{TEN_VU_AN}} trước ngày mở phiên tòa.</p>
    `
  },
  {
    formNumber: '36-HS',
    code: 'MAU_36_HS',
    name: 'Quyết định tạm đình chỉ vụ án (Thẩm phán chủ tọa phiên tòa)',
    stage: 'Trả hồ sơ & Đình chỉ',
    applicableLaw: 'Điều 281 Bộ luật Tố tụng hình sự 2015',
    description: 'Tạm đình chỉ khi bị can bị bệnh hiểm nghèo, chờ kết quả giám định hoặc bị can bỏ trốn và đã yêu cầu truy nã.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH TẠM ĐÌNH CHỈ VỤ ÁN HÌNH SỰ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Tạm đình chỉ giải quyết vụ án hình sự thụ lý số <strong>{{SO_THU_LY}}</strong> đối với bị cáo {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Lý do: Bị cáo bị bệnh tâm thần / Chờ kết luận giám định tư pháp / Bị cáo bỏ trốn đã có quyết định truy nã.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Khi lý do tạm đình chỉ không còn, vụ án sẽ được phục hồi giải quyết theo luật định.</p>
    `
  },
  {
    formNumber: '37-HS',
    code: 'MAU_37_HS',
    name: 'Quyết định tạm đình chỉ vụ án (Hội đồng xét xử sơ thẩm)',
    stage: 'Trả hồ sơ & Đình chỉ',
    applicableLaw: 'Điều 281 Bộ luật Tố tụng hình sự 2015',
    description: 'HĐXX quyết định tạm đình chỉ vụ án tại phiên tòa.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ SƠ THẨM',
    decisionTitle: 'QUYẾT ĐỊNH TẠM ĐÌNH CHỈ VỤ ÁN TẠI PHIÊN TÒA',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Quyết định tạm đình chỉ vụ án tại phiên tòa theo Điều 281 BLTTHS đối với bị cáo {{BI_CAN_BI_CAO}}.</p>
    `
  },
  {
    formNumber: '38-HS',
    code: 'MAU_38_HS',
    name: 'Quyết định tạm đình chỉ vụ án và áp dụng biện pháp bắt buộc chữa bệnh',
    stage: 'Trả hồ sơ & Đình chỉ',
    applicableLaw: 'Điều 281 và Điều 447 Bộ luật Tố tụng hình sự 2015',
    description: 'HĐXX quyết định tạm đình chỉ và áp dụng bắt buộc chữa bệnh đối với bị cáo mắc bệnh tâm thần tại tòa.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ SƠ THẨM',
    decisionTitle: 'QUYẾT ĐỊNH TẠM ĐÌNH CHỈ VỤ ÁN VÀ BẮT BUỘC CHỮA BỆNH',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Tạm đình chỉ vụ án và áp dụng biện pháp bắt buộc chữa bệnh đối với bị cáo: {{BI_CAN_BI_CAO}}.</p>
    `
  },
  {
    formNumber: '39-HS',
    code: 'MAU_39_HS',
    name: 'Quyết định đình chỉ vụ án (Thẩm phán chủ tọa phiên tòa)',
    stage: 'Trả hồ sơ & Đình chỉ',
    applicableLaw: 'Điều 282 Bộ luật Tố tụng hình sự 2015',
    description: 'Đình chỉ vụ án khi có một trong các căn cứ quy định tại khoản 2 Điều 155 hoặc Điều 157 BLTTHS (người bị hại rút yêu cầu, bị cáo chết...).',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH ĐÌNH CHỈ VỤ ÁN HÌNH SỰ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Đình chỉ vụ án hình sự thụ lý số <strong>{{SO_THU_LY}}</strong> đối với bị can / bị cáo: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Lý do: Người bị hại tự nguyện rút yêu cầu khởi tố theo quy định tại khoản 2 Điều 155 BLTTHS 2015.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Hủy bỏ các biện pháp ngăn chặn đã áp dụng đối với bị can, bị cáo.</p>
    `
  },
  {
    formNumber: '40-HS',
    code: 'MAU_40_HS',
    name: 'Quyết định đình chỉ vụ án (Hội đồng xét xử sơ thẩm)',
    stage: 'Trả hồ sơ & Đình chỉ',
    applicableLaw: 'Điều 299 Bộ luật Tố tụng hình sự 2015',
    description: 'HĐXX quyết định đình chỉ vụ án ngay tại phiên tòa sơ thẩm.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ SƠ THẨM',
    decisionTitle: 'QUYẾT ĐỊNH ĐÌNH CHỈ VỤ ÁN TẠI PHIÊN TÒA SƠ THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Hội đồng xét xử sơ thẩm quyết định đình chỉ vụ án hình sự đối với bị cáo: {{BI_CAN_BI_CAO}}.</p>
    `
  },
  {
    formNumber: '41-HS',
    code: 'MAU_41_HS',
    name: 'Quyết định phục hồi vụ án',
    stage: 'Trả hồ sơ & Đình chỉ',
    applicableLaw: 'Điều 283 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định phục hồi tiếp tục chuẩn bị xét xử sau khi lý do tạm đình chỉ đã chấm dứt (bị can đã khỏi bệnh, đã bắt được người truy nã...).',
    signerTitle: 'CHÁNH ÁN / THẨM PHÁN CHỦ TỌA',
    decisionTitle: 'QUYẾT ĐỊNH PHỤC HỒI VỤ ÁN HÌNH SỰ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Phục hồi giải quyết vụ án hình sự thụ lý số: <strong>{{SO_THU_LY}}</strong> đối với bị cáo {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Lý do: Lý do tạm đình chỉ vụ án đã chấm dứt.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Tiếp tục tính thời hạn chuẩn bị xét xử và tiến hành các thủ tục theo quy định.</p>
    `
  },

  // 6. Gia hạn chuẩn bị xét xử & Hoãn phiên tòa (Mẫu 42-HS, 43-HS, 44-HS)
  {
    formNumber: '42-HS',
    code: 'MAU_42_HS',
    name: 'Quyết định gia hạn thời hạn chuẩn bị xét xử (Chuẩn Mẫu số 42-HS TANDTC)',
    stage: 'Phân công & Chuẩn bị',
    applicableLaw: 'Điều 277 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định của Chánh án gia hạn thời hạn chuẩn bị xét xử đối với vụ án có tính chất phức tạp (gia hạn 15 ngày đối với tội ít/nghiêm trọng, 30 ngày đối với tội rất/đặc biệt nghiêm trọng).',
    signerTitle: 'CHÁNH ÁN TÒA ÁN NHÂN DÂN',
    decisionTitle: 'QUYẾT ĐỊNH GIA HẠN THỜI HẠN CHUẨN BỊ XÉT XỬ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Gia hạn thời hạn chuẩn bị xét xử vụ án hình sự thụ lý số: <strong>{{SO_THU_LY}}</strong> {{NGAY_THU_LY}} đối với bị cáo {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Thời hạn gia hạn: <strong>{{THOI_HAN_TAM_GIAM}}</strong>, kể từ ngày hết hạn chuẩn bị xét xử luật định ban đầu.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Lý do: Vụ án có tính chất phức tạp, nhiều bị cáo/đương sự cần thu thập thêm tài liệu chứng cứ.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thẩm phán chủ tọa phiên tòa và Thư ký khẩn trương hoàn tất hồ sơ, bảo đảm đưa vụ án ra xét xử đúng thời hạn gia hạn.</p>
    `
  },
  {
    formNumber: '43-HS',
    code: 'MAU_43_HS',
    name: 'Quyết định hoãn phiên tòa (Hội đồng xét xử)',
    stage: 'Phiên tòa & Nghị án',
    applicableLaw: 'Điều 297 Bộ luật Tố tụng hình sự 2015',
    description: 'HĐXX quyết định hoãn phiên tòa khi vắng mặt Kiểm sát viên, bị cáo, người bào chữa hoặc người làm chứng quan trọng.',
    signerTitle: 'THAY MẶT HỘI ĐỒNG XÉT XỬ - THẨM PHÁN CHỦ TỌA',
    decisionTitle: 'QUYẾT ĐỊNH HOÃN PHIÊN TÒA',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Hoãn phiên tòa xét xử sơ thẩm vụ án hình sự thụ lý số <strong>{{SO_THU_LY}}</strong> đối với bị cáo: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Lý do hoãn: Vắng mặt người bào chữa / đương sự / người làm chứng mà không có người thay thế và không thể xét xử vắng mặt.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thời gian mở lại phiên tòa sẽ được Tòa án thông báo bằng văn bản đến những người tham gia tố tụng (không quá 30 ngày kể từ ngày ra quyết định).</p>
    `
  },
  {
    formNumber: '44-HS',
    code: 'MAU_44_HS',
    name: 'Quyết định hoãn phiên tòa (Chánh án Tòa án)',
    stage: 'Phiên tòa & Nghị án',
    applicableLaw: 'Điều 297 Bộ luật Tố tụng hình sự 2015',
    description: 'Chánh án ra quyết định hoãn phiên tòa trước khi khai mạc do lý do bất khả kháng hoặc trở ngại khách quan.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN NHÂN DÂN',
    decisionTitle: 'QUYẾT ĐỊNH HOÃN PHIÊN TÒA CỦA CHÁNH ÁN',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Hoãn phiên tòa vụ án {{TEN_VU_AN}} dự kiến mở ngày {{NGAY_BAN_HANH}} do trở ngại khách quan.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Thẩm phán chủ tọa ấn định lịch mở lại phiên tòa đúng quy định.</p>
    `
  },

  // 7. Kháng cáo, Kháng nghị & Xét xử phúc thẩm (Mẫu 45-HS đến 52-HS)
  {
    formNumber: '45-HS',
    code: 'MAU_45_HS',
    name: 'Biên bản về việc kháng cáo',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 332 Bộ luật Tố tụng hình sự 2015',
    description: 'Lập biên bản khi bị cáo hoặc người có quyền kháng cáo nộp đơn hoặc trực tiếp đến Tòa án trình bày kháng cáo.',
    signerTitle: 'NGƯỜI KHÁNG CÁO & CÁN BỘ TÒA ÁN LẬP BIÊN BẢN',
    decisionTitle: 'BIÊN BẢN VỀ VIỆC KHÁNG CÁO',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Ghi nhận nội dung kháng cáo của bị cáo / người bị hại đối với Bản án sơ thẩm số {{SO_QUYET_DINH}} ngày {{NGAY_BAN_HANH}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Yêu cầu kháng cáo: Xin giảm nhẹ hình phạt / Đề nghị xét lại tội danh / Yêu cầu bồi thường dân sự.</p>
    `
  },
  {
    formNumber: '46-HS',
    code: 'MAU_46_HS',
    name: 'Quyết định về việc bảo lĩnh',
    stage: 'Tạm giam & Biện pháp ngăn chặn',
    applicableLaw: 'Điều 121 Bộ luật Tố tụng hình sự 2015',
    description: 'Áp dụng biện pháp bảo lĩnh của cơ quan, tổ chức hoặc người thân thích thay thế biện pháp tạm giam.',
    signerTitle: 'CHÁNH ÁN / THẨM PHÁN CHỦ TỌA PHIÊN TÒA',
    decisionTitle: 'QUYẾT ĐỊNH VỀ VIỆC BẢO LĨNH',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Áp dụng biện pháp bảo lĩnh đối với bị can, bị cáo: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Người nhận bảo lĩnh cam đoan không để bị can/bị cáo tiếp tục phạm tội và có mặt theo đúng giấy triệu tập.</p>
    `
  },
  {
    formNumber: '47-HS',
    code: 'MAU_47_HS',
    name: 'Quyết định về việc giải quyết kháng cáo quá hạn',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 335 Bộ luật Tố tụng hình sự 2015',
    description: 'Tòa án cấp phúc thẩm xem xét lý do bất khả kháng để chấp nhận hoặc không chấp nhận kháng cáo quá hạn.',
    signerTitle: 'HỘI ĐỒNG XÉT KHÁNG CÁO QUÁ HẠN TÒA ÁN CẤP PHÚC THẨM',
    decisionTitle: 'QUYẾT ĐỊNH VỀ VIỆC GIẢI QUYẾT KHÁNG CÁO QUÁ HẠN',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Hội đồng gồm 03 Thẩm phán quyết định chấp nhận / không chấp nhận việc kháng cáo quá hạn đối với bản án sơ thẩm.</p>
    `
  },
  {
    formNumber: '48-HS',
    code: 'MAU_48_HS',
    name: 'Thông báo về việc kháng cáo, kháng nghị bản án, quyết định hình sự',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 338 Bộ luật Tố tụng hình sự 2015',
    description: 'Tòa án sơ thẩm gửi thông báo bằng văn bản cho Viện kiểm sát và các đương sự về việc có kháng cáo, kháng nghị.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN NHÂN DÂN SƠ THẨM',
    decisionTitle: 'THÔNG BÁO VỀ VIỆC KHÁNG CÁO, KHÁNG NGHỊ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Tòa án nhân dân sơ thẩm thông báo về việc đã tiếp nhận đơn kháng cáo / quyết định kháng nghị đối với Bản án sơ thẩm vụ án {{TEN_VU_AN}}.</p>
    `
  },
  {
    formNumber: '49-HS',
    code: 'MAU_49_HS',
    name: 'Thông báo về việc rút kháng cáo hoặc rút kháng nghị',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 342 Bộ luật Tố tụng hình sự 2015',
    description: 'Thông báo người kháng cáo hoặc Viện kiểm sát rút toàn bộ hoặc một phần kháng cáo, kháng nghị.',
    signerTitle: 'TÒA ÁN CẤP PHÚC THẨM',
    decisionTitle: 'THÔNG BÁO VỀ VIỆC RÚT KHÁNG CÁO / KHÁNG NGHỊ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Thông báo người kháng cáo / Viện kiểm sát đã tự nguyện rút kháng cáo / kháng nghị đối với bản án sơ thẩm vụ án {{TEN_VU_AN}}.</p>
    `
  },
  {
    formNumber: '50-HS',
    code: 'MAU_50_HS',
    name: 'Thông báo về việc thay đổi, bổ sung kháng cáo, kháng nghị',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 342 Bộ luật Tố tụng hình sự 2015',
    description: 'Thông báo việc sửa đổi hoặc bổ sung thêm yêu cầu trong đơn kháng cáo/kháng nghị trước phiên tòa phúc thẩm.',
    signerTitle: 'TÒA ÁN CẤP PHÚC THẨM',
    decisionTitle: 'THÔNG BÁO THAY ĐỔI, BỔ SUNG KHÁNG CÁO / KHÁNG NGHỊ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Thông báo việc thay đổi, bổ sung nội dung kháng cáo của bị cáo {{BI_CAN_BI_CAO}}.</p>
    `
  },
  {
    formNumber: '51-HS',
    code: 'MAU_51_HS',
    name: 'Quyết định đình chỉ việc xét xử phúc thẩm (Thẩm phán chủ tọa phiên tòa)',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 348 Bộ luật Tố tụng hình sự 2015',
    description: 'Đình chỉ xét xử phúc thẩm trước khi mở phiên tòa khi người kháng cáo đã rút toàn bộ kháng cáo và VKS rút kháng nghị.',
    signerTitle: 'THẨM PHÁN CHỦ TỌA PHIÊN TÒA PHÚC THẨM',
    decisionTitle: 'QUYẾT ĐỊNH ĐÌNH CHỈ VIỆC XÉT XỬ PHÚC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Đình chỉ việc xét xử phúc thẩm vụ án hình sự đối với bị cáo: {{BI_CAN_BI_CAO}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Bản án sơ thẩm có hiệu lực pháp luật kể từ ngày ra quyết định này.</p>
    `
  },
  {
    formNumber: '52-HS',
    code: 'MAU_52_HS',
    name: 'Quyết định đình chỉ việc xét xử phúc thẩm (Hội đồng xét xử phúc thẩm)',
    stage: 'Kháng cáo & Phúc thẩm',
    applicableLaw: 'Điều 348 Bộ luật Tố tụng hình sự 2015',
    description: 'Đình chỉ xét xử phúc thẩm ngay tại phiên tòa phúc thẩm khi người kháng cáo rút đơn.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ PHÚC THẨM',
    decisionTitle: 'QUYẾT ĐỊNH ĐÌNH CHỈ XÉT XỬ PHÚC THẨM TẠI PHIÊN TÒA',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Hội đồng xét xử phúc thẩm quyết định đình chỉ việc xét xử phúc thẩm. Bản án hình sự sơ thẩm có hiệu lực thi hành.</p>
    `
  },

  // 8. Giám đốc thẩm & Khởi tố vụ án hình sự (Mẫu 53-HS đến 60-HS)
  {
    formNumber: '53-HS',
    code: 'MAU_53_HS',
    name: 'Thông báo về việc tiếp nhận đơn đề nghị / kiến nghị giám đốc thẩm',
    stage: 'Giám đốc thẩm & Khởi tố',
    applicableLaw: 'Điều 374 Bộ luật Tố tụng hình sự 2015',
    description: 'Tòa án có thẩm quyền thông báo đã tiếp nhận đơn đề nghị giám đốc thẩm bản án đã có hiệu lực.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN CÓ THẨM QUYỀN GIÁM ĐỐC THẨM',
    decisionTitle: 'THÔNG BÁO TIẾP NHẬN ĐƠN ĐỀ NGHỊ GIÁM ĐỐC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Tòa án nhân dân thông báo đã tiếp nhận đơn đề nghị xem xét bản án đã có hiệu lực pháp luật theo thủ tục giám đốc thẩm đối với vụ án {{TEN_VU_AN}}.</p>
    `
  },
  {
    formNumber: '54-HS',
    code: 'MAU_54_HS',
    name: 'Quyết định rút hồ sơ vụ án hình sự',
    stage: 'Giám đốc thẩm & Khởi tố',
    applicableLaw: 'Điều 374 Bộ luật Tố tụng hình sự 2015',
    description: 'Người có thẩm quyền kháng nghị rút hồ sơ vụ án từ Tòa án cấp dưới để nghiên cứu xem xét kháng nghị.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN CÓ THẨM QUYỀN KHÁNG NGHỊ',
    decisionTitle: 'QUYẾT ĐỊNH RÚT HỒ SƠ VỤ ÁN HÌNH SỰ',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Rút toàn bộ hồ sơ vụ án hình sự đã có hiệu lực pháp luật để nghiên cứu, xem xét theo thủ tục giám đốc thẩm / tái thẩm.</p>
    `
  },
  {
    formNumber: '55-HS',
    code: 'MAU_55_HS',
    name: 'Thông báo giải quyết đơn đề nghị / kiến nghị giám đốc thẩm',
    stage: 'Giám đốc thẩm & Khởi tố',
    applicableLaw: 'Điều 375 Bộ luật Tố tụng hình sự 2015',
    description: 'Thông báo kết quả giải quyết: Không có căn cứ kháng nghị hoặc Đã ban hành quyết định kháng nghị.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN CÓ THẨM QUYỀN KHÁNG NGHỊ',
    decisionTitle: 'THÔNG BÁO GIẢI QUYẾT ĐƠN ĐỀ NGHỊ GIÁM ĐỐC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Thông báo kết quả giải quyết đơn đề nghị giám đốc thẩm đối với Bản án số {{SO_QUYET_DINH}} vụ án {{TEN_VU_AN}}.</p>
    `
  },
  {
    formNumber: '56-HS',
    code: 'MAU_56_HS',
    name: 'Quyết định kháng nghị giám đốc thẩm',
    stage: 'Giám đốc thẩm & Khởi tố',
    applicableLaw: 'Điều 373 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định của Chánh án kháng nghị bản án đã có hiệu lực pháp luật có sai lầm nghiêm trọng trong áp dụng pháp luật.',
    signerTitle: 'CHÁNH ÁN TÒA ÁN NHÂN DÂN TỐI CAO / CẤP CAO',
    decisionTitle: 'QUYẾT ĐỊNH KHÁNG NGHỊ GIÁM ĐỐC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Kháng nghị theo thủ tục giám đốc thẩm đối với Bản án hình sự đã có hiệu lực pháp luật vụ án {{TEN_VU_AN}}.</p>
      <p style="text-indent: 25px; margin: 6px 0;">- Tạm đình chỉ thi hành bản án bị kháng nghị cho đến khi có quyết định giám đốc thẩm.</p>
    `
  },
  {
    formNumber: '57-HS',
    code: 'MAU_57_HS',
    name: 'Quyết định thay đổi, bổ sung hoặc rút kháng nghị giám đốc thẩm',
    stage: 'Giám đốc thẩm & Khởi tố',
    applicableLaw: 'Điều 384 Bộ luật Tố tụng hình sự 2015',
    description: 'Thay đổi, bổ sung thêm căn cứ hoặc rút lại quyết định kháng nghị giám đốc thẩm trước phiên họp.',
    signerTitle: 'NGƯỜI ĐÃ BAN HÀNH QUYẾT ĐỊNH KHÁNG NGHỊ',
    decisionTitle: 'QUYẾT ĐỊNH THAY ĐỔI / RÚT KHÁNG NGHỊ GIÁM ĐỐC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;">Quyết định thay đổi, bổ sung hoặc rút toàn bộ quyết định kháng nghị giám đốc thẩm số {{SO_QUYET_DINH}}.</p>
    `
  },
  {
    formNumber: '58-HS',
    code: 'MAU_58_HS',
    name: 'Quyết định đình chỉ xét xử giám đốc thẩm',
    stage: 'Giám đốc thẩm & Khởi tố',
    applicableLaw: 'Điều 385 Bộ luật Tố tụng hình sự 2015',
    description: 'Đình chỉ xét xử giám đốc thẩm khi người kháng nghị rút toàn bộ quyết định kháng nghị.',
    signerTitle: 'ỦY BAN THẨM PHÁN / HỘI ĐỒNG GIÁM ĐỐC THẨM',
    decisionTitle: 'QUYẾT ĐỊNH ĐÌNH CHỈ XÉT XỬ GIÁM ĐỐC THẨM',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Đình chỉ xét xử giám đốc thẩm vụ án hình sự đối với Bản án đã kháng nghị.</p>
    `
  },
  {
    formNumber: '59-HS',
    code: 'MAU_59_HS',
    name: 'Quyết định giám đốc thẩm',
    stage: 'Giám đốc thẩm & Khởi tố',
    applicableLaw: 'Điều 388 Bộ luật Tố tụng hình sự 2015',
    description: 'Quyết định của Ủy ban Thẩm phán/Hội đồng Thẩm phán bác kháng nghị, hủy bản án để điều tra lại hoặc xét xử lại.',
    signerTitle: 'HỘI ĐỒNG THẨM PHÁN / ỦY BAN THẨM PHÁN',
    decisionTitle: 'QUYẾT ĐỊNH GIÁM ĐỐC THẨM',
    specificArticlesHtml: `
      <div style="text-align: center; font-weight: bold; margin: 10px 0;">NHÂN DANH NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
      <p style="text-indent: 25px; margin: 6px 0;">Hội đồng Giám đốc thẩm quyết định chấp nhận kháng nghị; hủy bản án sơ thẩm/phúc thẩm đã có hiệu lực pháp luật để điều tra lại hoặc xét xử lại từ đầu theo đúng quy định pháp luật.</p>
    `
  },
  {
    formNumber: '60-HS',
    code: 'MAU_60_HS',
    name: 'Quyết định khởi tố vụ án hình sự (Hội đồng xét xử khởi tố tại phiên tòa)',
    stage: 'Giám đốc thẩm & Khởi tố',
    applicableLaw: 'Điều 153 Bộ luật Tố tụng hình sự 2015',
    description: 'Hội đồng xét xử ra quyết định khởi tố vụ án hình sự ngay tại phiên tòa khi phát hiện có dấu hiệu tội phạm mới.',
    signerTitle: 'HỘI ĐỒNG XÉT XỬ SƠ THẨM',
    decisionTitle: 'QUYẾT ĐỊNH KHỞI TỐ VỤ ÁN HÌNH SỰ TẠI PHIÊN TÒA',
    specificArticlesHtml: `
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 1.</strong> Khởi tố vụ án hình sự về tội: <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong> xảy ra tại địa bàn được phát hiện tại phiên tòa xét xử sơ thẩm.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 2.</strong> Chuyển Quyết định khởi tố này kèm theo các tài liệu, vật chứng liên quan cho Viện kiểm sát nhân dân cùng cấp để tiến hành điều tra theo thẩm quyền.</p>
      <p style="text-indent: 25px; margin: 6px 0;"><strong>Điều 3.</strong> Quyết định này có hiệu lực kể từ thời điểm công bố tại phiên tòa.</p>
    `
  }
];

export function buildStandardNQ05TemplateBody(meta: NQ05FormMeta): string {
  return `<div style="text-align: center; margin-bottom: 20px; font-family: 'Times New Roman', Times, serif;">
  <table style="width: 100%; border: none; font-size: 11pt;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">{{TEN_TOA_AN}}</div>
        <div style="font-size: 10pt; color: #333;">Số: {{SO_QUYET_DINH}}</div>
        <div style="font-size: 9.5pt; color: #666; margin-top: 3px;"><em>Mẫu số ${meta.formNumber} (NQ 05/2017/NQ-HĐTP)</em></div>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="border-bottom: 1px solid #333; width: 140px; margin: 3px auto 6px auto;"></div>
        <div style="font-style: italic; font-size: 10.5pt;">{{TINH_THANH}}, {{NGAY_BAN_HANH}}</div>
      </td>
    </tr>
  </table>
</div>

<div style="text-align: center; margin: 25px 0 20px 0; font-family: 'Times New Roman', Times, serif;">
  <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">${meta.decisionTitle}</h2>
  <div style="font-size: 10pt; font-style: italic; color: #444; margin-top: 5px;">(Ban hành kèm theo Nghị quyết số 05/2017/NQ-HĐTP ngày 19/9/2017 của Hội đồng Thẩm phán TANDTC)</div>
</div>

<div style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 15px; font-family: 'Times New Roman', Times, serif;">
  ${meta.signerTitle}
</div>

<div style="line-height: 1.6; text-align: justify; font-size: 11.5pt; font-family: 'Times New Roman', Times, serif;">
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ vào Luật Tổ chức Tòa án nhân dân năm 2014;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ vào ${meta.applicableLaw};
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Sau khi xem xét hồ sơ vụ án hình sự sơ thẩm thụ lý số <strong>{{SO_THU_LY}}</strong> ngày {{NGAY_THU_LY}};
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Đối với bị can, bị cáo: <strong>{{TEN_VU_AN}}</strong> (Mã vụ việc: {{MA_VU_VIEC}});
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Về tội danh: <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong> theo Cáo trạng: {{CAN_CU_PHAP_LY}},
  </p>

  <div style="text-align: center; font-weight: bold; font-size: 12.5pt; margin: 15px 0 10px 0;">
    QUYẾT ĐỊNH:
  </div>

  ${meta.specificArticlesHtml}

  <p style="text-indent: 25px; margin: 6px 0;">
    Quyết định này có hiệu lực kể từ ngày ký và được tống đạt cho các bên có nghĩa vụ thi hành theo đúng quy định của Bộ luật Tố tụng hình sự./.
  </p>
</div>

<table style="width: 100%; margin-top: 30px; font-size: 11pt; border: none; font-family: 'Times New Roman', Times, serif;">
  <tr>
    <td style="width: 50%; vertical-align: top; font-size: 10pt;">
      <strong><em>Nơi nhận:</em></strong><br>
      - Viện kiểm sát nhân dân cùng cấp;<br>
      - Bị can, bị cáo, người bào chữa;<br>
      - Cơ quan THA hình sự Công an có thẩm quyền;<br>
      - Trại tạm giam (để thi hành nếu có);<br>
      - Lưu: Hồ sơ vụ án, VT-TA.
    </td>
    <td style="width: 50%; vertical-align: top; text-align: center;">
      <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase;">${meta.signerTitle}</div>
      <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
      <div style="height: 60px;"></div>
      <div style="font-weight: bold; font-size: 12pt;">{{THAM_PHAN}}</div>
    </td>
  </tr>
</table>`;
}

export function generateAllNQ05Templates(): DocumentTemplate[] {
  return NQ05_FORMS_CATALOG.map((meta, index) => {
    return {
      id: `tmpl-nq05-${meta.formNumber.toLowerCase()}`,
      code: meta.code,
      formNumber: meta.formNumber,
      name: `[${meta.formNumber}] ${meta.name}`,
      category: 'HINH_SU',
      applicableLaw: meta.applicableLaw,
      description: meta.description,
      isSystem: true,
      stage: meta.stage,
      resolution: 'NQ 05/2017/NQ-HĐTP',
      templateBody: buildStandardNQ05TemplateBody(meta),
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-06-27T00:00:00Z',
    };
  });
}
