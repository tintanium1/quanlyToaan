import { DocumentTemplate, CourtCase, CourtUnitSettings } from '../types/court';
import { formatDateFormalVN, formatDateVN } from '../utils/courtUtils';
import { generateAllNQ05Templates } from './criminalTemplatesNQ05';

const BASE_DEFAULT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'tmpl-01',
    code: 'MAU_01_PC',
    name: 'Quyết định phân công Thẩm phán giải quyết vụ án (Mẫu số 01-TA)',
    category: 'ALL',
    applicableLaw: 'Điều 45 Bộ luật Tố tụng Hình sự; Điều 48 Bộ luật Tố tụng Dân sự',
    description: 'Quyết định của Chánh án Tòa án nhân dân phân công Thẩm phán chủ tọa phiên tòa, Thẩm phán dự khuyết, Thư ký và Hội thẩm nhân dân.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    templateBody: `<div style="text-align: center; margin-bottom: 20px;">
  <table style="width: 100%; border: none; font-size: 11pt;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">{{TEN_TOA_AN}}</div>
        <div style="font-size: 10pt; color: #333;">Số: {{SO_QUYET_DINH}}</div>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="font-style: italic; font-size: 10.5pt; margin-top: 4px;">{{TINH_THANH}}, {{NGAY_BAN_HANH}}</div>
      </td>
    </tr>
  </table>
</div>

<div style="text-align: center; margin: 25px 0 20px 0;">
  <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">QUYẾT ĐỊNH</h2>
  <h3 style="font-size: 12.5pt; font-weight: bold; text-transform: uppercase; margin: 5px 0 0 0;">
    PHÂN CÔNG THẨM PHÁN GIẢI QUYẾT VỤ ÁN
  </h3>
</div>

<div style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 15px;">
  CHÁNH ÁN TÒA ÁN NHÂN DÂN
</div>

<div style="line-height: 1.6; text-align: justify; font-size: 11.5pt;">
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ vào Luật Tổ chức Tòa án nhân dân;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ vào các quy định của pháp luật Tố tụng hiện hành;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ vào hồ sơ vụ án thụ lý số <strong>{{SO_THU_LY}}</strong> {{NGAY_THU_LY}}; Mã vụ việc: <strong>{{MA_VU_VIEC}}</strong>;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Về việc: <em>{{TOI_DANH_HOAC_TRANH_CHAP}}</em>;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ hồ sơ truy tố / đơn khởi kiện: {{CAN_CU_PHAP_LY}},
  </p>

  <div style="text-align: center; font-weight: bold; font-size: 12.5pt; margin: 15px 0 10px 0;">
    QUYẾT ĐỊNH:
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 1.</strong> Phân công Thẩm phán: <strong>{{THAM_PHAN}}</strong> - {{NGACH_THAM_PHAN}} làm chủ tọa phiên tòa giải quyết vụ án nêu trên.
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    - Thẩm phán dự khuyết (nếu có): {{THAM_PHAN_DU_KHUYET}}.
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    - Phân công Thư ký Tòa án: <strong>{{THU_KY}}</strong> tiến hành các hoạt động tố tụng theo quy định. Thư ký dự khuyết: {{THU_KY_DU_KHUYET}}.
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    - Thành phần Hội đồng xét xử (Hội thẩm nhân dân):
  </p>
  <div style="margin-left: 35px; margin-bottom: 8px;">
    {{HOI_THAM_NHAN_DAN}}
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 2.</strong> Thẩm phán và Thư ký Tòa án được phân công có trách nhiệm thực hiện đầy đủ các nhiệm vụ, quyền hạn theo quy định của pháp luật Tố tụng, bảo đảm thời hạn giải quyết và chất lượng xét xử.
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 3.</strong> Quyết định này có hiệu lực kể từ ngày ký. Các ông/bà có tên tại Điều 1 và các bộ phận nghiệp vụ Tòa án nhân dân chịu trách nhiệm thi hành Quyết định này./.
  </p>
</div>

<table style="width: 100%; margin-top: 30px; font-size: 11pt; border: none;">
  <tr>
    <td style="width: 50%; vertical-align: top; font-size: 10pt;">
      <strong><em>Nơi nhận:</em></strong><br>
      - Viện kiểm sát nhân dân cùng cấp;<br>
      - Như Điều 3 (để thi hành);<br>
      - Lưu hồ sơ vụ án, VT-TA.
    </td>
    <td style="width: 50%; vertical-align: top; text-align: center;">
      <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase;">CHÁNH ÁN</div>
      <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
      <div style="height: 65px;"></div>
      <div style="font-weight: bold; font-size: 12pt;">{{CHANH_AN}}</div>
    </td>
  </tr>
</table>`,
  },
  {
    id: 'tmpl-02',
    code: 'MAU_02_LTG',
    name: 'Lệnh tạm giam của Tòa án nhân dân (Mẫu số 02-HS)',
    category: 'HINH_SU',
    applicableLaw: 'Điều 44, Điều 119 và Điều 278 Bộ luật Tố tụng Hình sự 2015',
    description: 'Lệnh tạm giam áp dụng đối với bị can, bị cáo trong giai đoạn chuẩn bị xét xử để bảo đảm xét xử và thi hành án.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    templateBody: `<div style="text-align: center; margin-bottom: 20px;">
  <table style="width: 100%; border: none; font-size: 11pt;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">{{TEN_TOA_AN}}</div>
        <div style="font-size: 10pt; color: #333;">Số: {{SO_QUYET_DINH}}</div>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="font-style: italic; font-size: 10.5pt; margin-top: 4px;">{{TINH_THANH}}, {{NGAY_BAN_HANH}}</div>
      </td>
    </tr>
  </table>
</div>

<div style="text-align: center; margin: 25px 0 20px 0;">
  <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">LỆNH TẠM GIAM</h2>
</div>

<div style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 15px;">
  TÒA ÁN NHÂN DÂN
</div>

<div style="line-height: 1.6; text-align: justify; font-size: 11.5pt;">
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ các điều 44, 119 và 278 Bộ luật Tố tụng Hình sự 2015;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Xét thấy cần tiếp tục tạm giam bị cáo để bảo đảm chuẩn bị xét xử và thi hành án đối với vụ án hình sự thụ lý số <strong>{{SO_THU_LY}}</strong> {{NGAY_THU_LY}},
  </p>

  <div style="text-align: center; font-weight: bold; font-size: 12.5pt; margin: 15px 0 10px 0;">
    RA LỆNH:
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 1.</strong> Tạm giam đối với bị can / bị cáo:
  </p>
  <div style="margin-left: 30px; margin-bottom: 10px; line-height: 1.7;">
    {{BI_CAN_BI_CAO}}
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    Bị truy tố về tội danh: <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong> theo Cáo trạng: {{CAN_CU_PHAP_LY}}.
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 2.</strong> Thời hạn tạm giam là: <strong>{{THOI_HAN_TAM_GIAM}}</strong>, kể từ ngày hết hạn của lệnh trước cho đến ngày <strong>{{NGAY_HET_HAN_TAM_GIAM}}</strong>.
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Nơi tạm giam: Trại tạm giam Công an tỉnh / Nhà tạm giữ có thẩm quyền.
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 3.</strong> Cơ quan thi hành tạm giữ, tạm giam, Trại tạm giam Công an và bị can/bị cáo có tên tại Điều 1 có trách nhiệm thi hành Lệnh này./.
  </p>
</div>

<table style="width: 100%; margin-top: 30px; font-size: 11pt; border: none;">
  <tr>
    <td style="width: 50%; vertical-align: top; font-size: 10pt;">
      <strong><em>Nơi nhận:</em></strong><br>
      - Viện kiểm sát nhân dân cùng cấp;<br>
      - Cơ quan THA hình sự Công an tỉnh;<br>
      - Trại tạm giam (để thi hành);<br>
      - Bị can/bị cáo (để biết);<br>
      - Lưu: Hồ sơ vụ án, VT-TA.
    </td>
    <td style="width: 50%; vertical-align: top; text-align: center;">
      <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase;">CHÁNH ÁN / THẨM PHÁN CHỦ TỌA</div>
      <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
      <div style="height: 65px;"></div>
      <div style="font-weight: bold; font-size: 12pt;">{{CHANH_AN}}</div>
    </td>
  </tr>
</table>`,
  },
  {
    id: 'tmpl-03',
    code: 'MAU_03_XX',
    name: 'Quyết định đưa vụ án ra xét xử sơ thẩm (Mẫu số 03-TA)',
    category: 'ALL',
    applicableLaw: 'Điều 277 Bộ luật Tố tụng Hình sự 2015; Điều 220 Bộ luật Tố tụng Dân sự 2015',
    description: 'Quyết định mở phiên tòa xét xử sơ thẩm công khai, ấn định thời gian, địa điểm và người tham gia tố tụng.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    templateBody: `<div style="text-align: center; margin-bottom: 20px;">
  <table style="width: 100%; border: none; font-size: 11pt;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">{{TEN_TOA_AN}}</div>
        <div style="font-size: 10pt; color: #333;">Số: {{SO_QUYET_DINH}}</div>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="font-style: italic; font-size: 10.5pt; margin-top: 4px;">{{TINH_THANH}}, {{NGAY_BAN_HANH}}</div>
      </td>
    </tr>
  </table>
</div>

<div style="text-align: center; margin: 25px 0 20px 0;">
  <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">QUYẾT ĐỊNH</h2>
  <h3 style="font-size: 12.5pt; font-weight: bold; text-transform: uppercase; margin: 5px 0 0 0;">
    ĐƯA VỤ ÁN RA XÉT XỬ SƠ THẨM
  </h3>
</div>

<div style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 15px;">
  TÒA ÁN NHÂN DÂN
</div>

<div style="line-height: 1.6; text-align: justify; font-size: 11.5pt;">
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ vào các điều luật tố tụng tương ứng của pháp luật Việt Nam;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Sau khi nghiên cứu hồ sơ vụ án thụ lý số <strong>{{SO_THU_LY}}</strong> {{NGAY_THU_LY}};
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Về việc: <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong>;
  </p>

  <div style="text-align: center; font-weight: bold; font-size: 12.5pt; margin: 15px 0 10px 0;">
    QUYẾT ĐỊNH:
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>I.</strong> Đưa ra xét xử sơ thẩm công khai vụ án đối với:
  </p>
  <div style="margin-left: 30px; margin-bottom: 10px;">
    {{DUONG_SU}}
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>II. Thời gian mở phiên tòa:</strong> Hồi 08 giờ 00 phút, {{NGAY_BAN_HANH}}.
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Địa điểm mở phiên tòa:</strong> Phòng xử án số 01 - Trụ sở {{TEN_TOA_AN}} (Địa chỉ: {{DIA_CHI_TOA_AN}}).
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>III. Những người tiến hành tố tụng:</strong>
  </p>
  <div style="margin-left: 30px; margin-bottom: 10px;">
    <div>- Thẩm phán chủ tọa phiên tòa: <strong>{{THAM_PHAN}}</strong></div>
    <div>- Các Hội thẩm nhân dân:</div>
    <div style="margin-left: 15px;">{{HOI_THAM_NHAN_DAN}}</div>
    <div>- Thư ký Tòa án ghi biên bản phiên tòa: <strong>{{THU_KY}}</strong></div>
    <div>- Đại diện Viện kiểm sát nhân dân tham gia phiên tòa: Kiểm sát viên VKSND cùng cấp.</div>
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>IV. Những người tham gia tố tụng khác:</strong> Được triệu tập theo giấy triệu tập của Tòa án nhân dân./.
  </p>
</div>

<table style="width: 100%; margin-top: 30px; font-size: 11pt; border: none;">
  <tr>
    <td style="width: 50%; vertical-align: top; font-size: 10pt;">
      <strong><em>Nơi nhận:</em></strong><br>
      - Viện kiểm sát nhân dân cùng cấp;<br>
      - Các đương sự, bị cáo, người bị hại;<br>
      - Người bảo vệ quyền lợi hợp pháp;<br>
      - Lưu: Hồ sơ vụ án, VT-TA.
    </td>
    <td style="width: 50%; vertical-align: top; text-align: center;">
      <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase;">THẨM PHÁN CHỦ TỌA PHIÊN TÒA</div>
      <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
      <div style="height: 65px;"></div>
      <div style="font-weight: bold; font-size: 12pt;">{{THAM_PHAN}}</div>
    </td>
  </tr>
</table>`,
  },
  {
    id: 'tmpl-04',
    code: 'MAU_04_GH',
    name: 'Quyết định gia hạn thời hạn chuẩn bị xét xử (Mẫu số 04-TA)',
    category: 'ALL',
    applicableLaw: 'Điều 277 Bộ luật Tố tụng Hình sự; Điều 203 Bộ luật Tố tụng Dân sự',
    description: 'Quyết định của Chánh án gia hạn thời hạn giải quyết do vụ án có tính chất phức tạp, cần thêm thời gian giám định, định giá tài sản hoặc ủy thác tư pháp.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    templateBody: `<div style="text-align: center; margin-bottom: 20px;">
  <table style="width: 100%; border: none; font-size: 11pt;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">{{TEN_TOA_AN}}</div>
        <div style="font-size: 10pt; color: #333;">Số: {{SO_QUYET_DINH}}</div>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="font-style: italic; font-size: 10.5pt; margin-top: 4px;">{{TINH_THANH}}, {{NGAY_BAN_HANH}}</div>
      </td>
    </tr>
  </table>
</div>

<div style="text-align: center; margin: 25px 0 20px 0;">
  <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">QUYẾT ĐỊNH</h2>
  <h3 style="font-size: 12.5pt; font-weight: bold; text-transform: uppercase; margin: 5px 0 0 0;">
    GIA HẠN THỜI HẠN CHUẨN BỊ XÉT XỬ
  </h3>
</div>

<div style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 15px;">
  CHÁNH ÁN TÒA ÁN NHÂN DÂN
</div>

<div style="line-height: 1.6; text-align: justify; font-size: 11.5pt;">
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ các quy định về gia hạn thời hạn chuẩn bị xét xử của Bộ luật Tố tụng;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Xét đề nghị bằng văn bản của Thẩm phán <strong>{{THAM_PHAN}}</strong> được phân công giải quyết vụ án số <strong>{{SO_THU_LY}}</strong> {{NGAY_THU_LY}};
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Xét thấy vụ án có nhiều tình tiết phức tạp, cần thu thập thêm chứng cứ, chờ kết quả định giá tài sản hoặc ủy thác xác minh,
  </p>

  <div style="text-align: center; font-weight: bold; font-size: 12.5pt; margin: 15px 0 10px 0;">
    QUYẾT ĐỊNH:
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 1.</strong> Gia hạn thời hạn chuẩn bị xét xử đối với vụ án: <strong>{{TEN_VU_AN}}</strong> (Mã vụ việc: {{MA_VU_VIEC}}).
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    - Thời gian gia hạn: <strong>01 tháng (30 ngày)</strong>.
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 2.</strong> Thẩm phán và Thư ký được phân công khẩn trương hoàn thiện các tài liệu tố tụng còn thiếu, bảo đảm đưa vụ án ra xét xử đúng thời hạn gia hạn.
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 3.</strong> Quyết định này có hiệu lực kể từ ngày ký./.
  </p>
</div>

<table style="width: 100%; margin-top: 30px; font-size: 11pt; border: none;">
  <tr>
    <td style="width: 50%; vertical-align: top; font-size: 10pt;">
      <strong><em>Nơi nhận:</em></strong><br>
      - Viện kiểm sát nhân dân cùng cấp;<br>
      - Thẩm phán giải quyết (để thực hiện);<br>
      - Các đương sự trong vụ án;<br>
      - Lưu: Hồ sơ vụ án, VT-TA.
    </td>
    <td style="width: 50%; vertical-align: top; text-align: center;">
      <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase;">CHÁNH ÁN</div>
      <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
      <div style="height: 65px;"></div>
      <div style="font-weight: bold; font-size: 12pt;">{{CHANH_AN}}</div>
    </td>
  </tr>
</table>`,
  },
  {
    id: 'tmpl-05',
    code: 'MAU_05_CNTT',
    name: 'Quyết định công nhận sự thỏa thuận của các đương sự (Mẫu số 05-DS/HNGĐ)',
    category: 'DAN_SU',
    applicableLaw: 'Điều 212 và Điều 213 Bộ luật Tố tụng Dân sự 2015',
    description: 'Quyết định có hiệu lực pháp luật ngay, công nhận sự thỏa thuận của các bên sau phiên hòa giải thành (Ly hôn, phân chia tài sản, thanh toán nợ vay...).',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    templateBody: `<div style="text-align: center; margin-bottom: 20px;">
  <table style="width: 100%; border: none; font-size: 11pt;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">{{TEN_TOA_AN}}</div>
        <div style="font-size: 10pt; color: #333;">Số: {{SO_QUYET_DINH}}</div>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="font-style: italic; font-size: 10.5pt; margin-top: 4px;">{{TINH_THANH}}, {{NGAY_BAN_HANH}}</div>
      </td>
    </tr>
  </table>
</div>

<div style="text-align: center; margin: 25px 0 20px 0;">
  <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">QUYẾT ĐỊNH</h2>
  <h3 style="font-size: 12.5pt; font-weight: bold; text-transform: uppercase; margin: 5px 0 0 0;">
    CÔNG NHẬN SỰ THỎA THUẬN CỦA CÁC ĐƯƠNG SỰ
  </h3>
</div>

<div style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 15px;">
  TÒA ÁN NHÂN DÂN
</div>

<div style="line-height: 1.6; text-align: justify; font-size: 11.5pt;">
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ vào Điều 212 và Điều 213 Bộ luật Tố tụng Dân sự 2015;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ vào Biên bản hòa giải thành ngày lập tại Tòa án nhân dân đối với vụ việc số <strong>{{SO_THU_LY}}</strong>;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Xét thấy sự thỏa thuận của các đương sự được ghi trong biên bản hòa giải thành là hoàn toàn tự nguyện và không vi phạm điều cấm của luật, không trái đạo đức xã hội;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Đã hết thời hạn 07 ngày, kể từ ngày lập biên bản hòa giải thành, không có đương sự nào thay đổi ý kiến về sự thỏa thuận đó,
  </p>

  <div style="text-align: center; font-weight: bold; font-size: 12.5pt; margin: 15px 0 10px 0;">
    QUYẾT ĐỊNH:
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>1. Công nhận sự thỏa thuận của các đương sự:</strong>
  </p>
  <div style="margin-left: 30px; margin-bottom: 8px;">
    {{DUONG_SU}}
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>2. Sự thỏa thuận của các đương sự cụ thể như sau:</strong>
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    - Về nội dung tranh chấp: Các bên đã tự nguyện thống nhất phương án hòa giải đối với quan hệ pháp luật <em>{{TOI_DANH_HOAC_TRANH_CHAP}}</em>.
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    - Về án phí Tòa án: Các đương sự tự nguyện chịu án phí theo thỏa thuận và quy định của pháp luật.
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>3.</strong> Quyết định này có hiệu lực pháp luật ngay sau khi được ban hành và không bị kháng cáo, kháng nghị theo thủ tục phúc thẩm./.
  </p>
</div>

<table style="width: 100%; margin-top: 30px; font-size: 11pt; border: none;">
  <tr>
    <td style="width: 50%; vertical-align: top; font-size: 10pt;">
      <strong><em>Nơi nhận:</em></strong><br>
      - Viện kiểm sát nhân dân cùng cấp;<br>
      - Chi cục THADS có thẩm quyền;<br>
      - Các đương sự;<br>
      - Lưu: Hồ sơ vụ án, VT-TA.
    </td>
    <td style="width: 50%; vertical-align: top; text-align: center;">
      <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase;">THẨM PHÁN</div>
      <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
      <div style="height: 65px;"></div>
      <div style="font-weight: bold; font-size: 12pt;">{{THAM_PHAN}}</div>
    </td>
  </tr>
</table>`,
  },
  {
    id: 'tmpl-06',
    code: 'MAU_06_BPKCTT',
    name: 'Quyết định áp dụng biện pháp khẩn cấp tạm thời (Mẫu số 06-BPKCTT)',
    category: 'DAN_SU',
    applicableLaw: 'Điều 111 đến Điều 133 Bộ luật Tố tụng Dân sự 2015',
    description: 'Quyết định áp dụng kê biên tài sản, phong tỏa tài khoản hoặc cấm chuyển dịch tài sản nhằm bảo toàn chứng cứ và bảo đảm thi hành án.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    templateBody: `<div style="text-align: center; margin-bottom: 20px;">
  <table style="width: 100%; border: none; font-size: 11pt;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">{{TEN_TOA_AN}}</div>
        <div style="font-size: 10pt; color: #333;">Số: {{SO_QUYET_DINH}}</div>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="font-style: italic; font-size: 10.5pt; margin-top: 4px;">{{TINH_THANH}}, {{NGAY_BAN_HANH}}</div>
      </td>
    </tr>
  </table>
</div>

<div style="text-align: center; margin: 25px 0 20px 0;">
  <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">QUYẾT ĐỊNH</h2>
  <h3 style="font-size: 12.5pt; font-weight: bold; text-transform: uppercase; margin: 5px 0 0 0;">
    ÁP DỤNG BIỆN PHÁP KHẨN CẤP TẠM THỜI
  </h3>
</div>

<div style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 15px;">
  TÒA ÁN NHÂN DÂN
</div>

<div style="line-height: 1.6; text-align: justify; font-size: 11.5pt;">
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ vào các điều 111, 114, 126 Bộ luật Tố tụng Dân sự 2015;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Sau khi xem xét đơn yêu cầu áp dụng biện pháp khẩn cấp tạm thời của đương sự trong vụ án số <strong>{{SO_THU_LY}}</strong> {{NGAY_THU_LY}};
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Xét thấy việc áp dụng biện pháp khẩn cấp tạm thời là cấp bách và cần thiết để bảo đảm quyền lợi hợp pháp của đương sự và bảo đảm việc thi hành án sau này,
  </p>

  <div style="text-align: center; font-weight: bold; font-size: 12.5pt; margin: 15px 0 10px 0;">
    QUYẾT ĐỊNH:
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 1.</strong> Áp dụng biện pháp khẩn cấp tạm thời: <strong>Kê biên tài sản đang tranh chấp / Phong tỏa tài khoản tại tổ chức tín dụng</strong> đối với:
  </p>
  <div style="margin-left: 30px; margin-bottom: 10px;">
    {{BI_DON}}
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 2.</strong> Cơ quan Thi hành án dân sự có thẩm quyền và Ngân hàng / Tổ chức tín dụng có trách nhiệm phối hợp thực hiện ngay Quyết định này.
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 3.</strong> Quyết định này có hiệu lực thi hành ngay./.
  </p>
</div>

<table style="width: 100%; margin-top: 30px; font-size: 11pt; border: none;">
  <tr>
    <td style="width: 50%; vertical-align: top; font-size: 10pt;">
      <strong><em>Nơi nhận:</em></strong><br>
      - Viện kiểm sát nhân dân cùng cấp;<br>
      - Cơ quan Thi hành án dân sự;<br>
      - Các đương sự;<br>
      - Lưu: Hồ sơ vụ án, VT-TA.
    </td>
    <td style="width: 50%; vertical-align: top; text-align: center;">
      <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase;">THẨM PHÁN</div>
      <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
      <div style="height: 65px;"></div>
      <div style="font-weight: bold; font-size: 12pt;">{{THAM_PHAN}}</div>
    </td>
  </tr>
</table>`,
  },
  {
    id: 'tmpl-07',
    code: 'MAU_07_GHTG',
    name: 'Lệnh gia hạn thời hạn tạm giam (Mẫu số 07-HS / Điều 278 BLTTHS)',
    category: 'HINH_SU',
    applicableLaw: 'Điều 44, Điều 119 và Điều 278 Bộ luật Tố tụng Hình sự 2015',
    description: 'Lệnh của Tòa án gia hạn thời hạn tạm giam đối với bị can, bị cáo đang bị tạm giam để hoàn thành việc chuẩn bị xét xử hoặc phục vụ xét xử tại phiên tòa.',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    templateBody: `<div style="text-align: center; margin-bottom: 20px;">
  <table style="width: 100%; border: none; font-size: 11pt;">
    <tr>
      <td style="width: 45%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">{{TEN_TOA_AN}}</div>
        <div style="font-size: 10pt; color: #333;">Số: {{SO_QUYET_DINH}}</div>
      </td>
      <td style="width: 55%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-weight: bold;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="font-style: italic; font-size: 10.5pt; margin-top: 4px;">{{TINH_THANH}}, {{NGAY_BAN_HANH}}</div>
      </td>
    </tr>
  </table>
</div>

<div style="text-align: center; margin: 25px 0 20px 0;">
  <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0;">LỆNH</h2>
  <h3 style="font-size: 12.5pt; font-weight: bold; text-transform: uppercase; margin: 5px 0 0 0;">
    GIA HẠN THỜI HẠN TẠM GIAM
  </h3>
</div>

<div style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 15px;">
  TÒA ÁN NHÂN DÂN
</div>

<div style="line-height: 1.6; text-align: justify; font-size: 11.5pt;">
  <p style="text-indent: 25px; margin: 6px 0;">
    Căn cứ các điều 44, 119 và Điều 278 Bộ luật Tố tụng Hình sự 2015;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Xét thấy vụ án hình sự sơ thẩm thụ lý số <strong>{{SO_THU_LY}}</strong> {{NGAY_THU_LY}} đối với bị cáo <strong>{{TEN_VU_AN}}</strong> có tính chất phức tạp, thời hạn tạm giam theo Lệnh tạm giam trước sắp hết hạn;
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Xét thấy cần tiếp tục tạm giam bị cáo để hoàn thành việc chuẩn bị xét xử và ngăn ngừa bị cáo trốn tránh, tiêu hủy chứng cứ hoặc cản trở hoạt động xét xử,
  </p>

  <div style="text-align: center; font-weight: bold; font-size: 12.5pt; margin: 15px 0 10px 0;">
    RA LỆNH:
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 1.</strong> Gia hạn thời hạn tạm giam đối với bị can / bị cáo:
  </p>
  <div style="margin-left: 30px; margin-bottom: 10px; line-height: 1.7;">
    {{BI_CAN_BI_CAO}}
  </div>

  <p style="text-indent: 25px; margin: 6px 0;">
    Bị truy tố về tội danh: <strong>{{TOI_DANH_HOAC_TRANH_CHAP}}</strong>.
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 2.</strong> Thời hạn gia hạn tạm giam là: <strong>{{THOI_HAN_TAM_GIAM}}</strong>, kể từ ngày hết hạn của lệnh tạm giam trước cho đến hết ngày <strong>{{NGAY_HET_HAN_TAM_GIAM}}</strong>.
  </p>
  <p style="text-indent: 25px; margin: 6px 0;">
    Nơi tạm giam: Trại tạm giam Công an tỉnh / Nhà tạm giữ Công an có thẩm quyền.
  </p>

  <p style="text-indent: 25px; margin: 6px 0;">
    <strong>Điều 3.</strong> Trại tạm giam Công an, Cơ quan Thi hành án hình sự có thẩm quyền và bị can/bị cáo có tên tại Điều 1 có trách nhiệm thi hành Lệnh này./.
  </p>
</div>

<table style="width: 100%; margin-top: 30px; font-size: 11pt; border: none;">
  <tr>
    <td style="width: 50%; vertical-align: top; font-size: 10pt;">
      <strong><em>Nơi nhận:</em></strong><br>
      - Viện kiểm sát nhân dân cùng cấp;<br>
      - Cơ quan THA hình sự Công an tỉnh;<br>
      - Trại tạm giam (để thi hành);<br>
      - Bị can/bị cáo (để biết);<br>
      - Lưu: Hồ sơ vụ án, VT-TA.
    </td>
    <td style="width: 50%; vertical-align: top; text-align: center;">
      <div style="font-weight: bold; font-size: 12pt; text-transform: uppercase;">THẨM PHÁN CHỦ TỌA / CHÁNH ÁN</div>
      <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
      <div style="height: 65px;"></div>
      <div style="font-weight: bold; font-size: 12pt;">{{THAM_PHAN}}</div>
    </td>
  </tr>
</table>`,
  },
];

export const NQ05_CRIMINAL_TEMPLATES = generateAllNQ05Templates();

export const DEFAULT_TEMPLATES: DocumentTemplate[] = [
  ...BASE_DEFAULT_TEMPLATES,
  ...NQ05_CRIMINAL_TEMPLATES,
];

export const TEMPLATE_STORAGE_KEY = 'toaan_document_templates_v2';

export function getStoredTemplates(): DocumentTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY) || localStorage.getItem('toaan_document_templates_v1');
    if (!raw) return DEFAULT_TEMPLATES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_TEMPLATES;

    // Check if NQ 05 criminal templates are present
    const hasNQ05 = parsed.some((t: DocumentTemplate) => t.code && t.code.includes('MAU_01_HS'));
    if (!hasNQ05) {
      // Auto merge NQ 05 criminal templates
      const merged = [...parsed, ...NQ05_CRIMINAL_TEMPLATES];
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return parsed;
  } catch (e) {
    console.error('Failed to load templates from localStorage', e);
    return DEFAULT_TEMPLATES;
  }
}

export function saveStoredTemplates(templates: DocumentTemplate[]): void {
  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save templates to localStorage', e);
  }
}

/**
 * Replaces all {{TAGS}} in a template with actual case data
 */
export function renderTemplateWithCase(
  template: DocumentTemplate,
  caseItem: CourtCase,
  settings: CourtUnitSettings,
  customDecisionNo?: string
): string {
  let content = template.templateBody;

  // Format jurors list
  let jurorsHtml = 'Chưa phân công Hội thẩm nhân dân';
  if (caseItem.assignedJurors && caseItem.assignedJurors.length > 0) {
    jurorsHtml = caseItem.assignedJurors
      .map(
        (j, idx) =>
          `<div>${idx + 1}. Ông/Bà: <strong>${j.name}</strong> ${
            j.organization ? `(${j.organization})` : ''
          } ${j.isAlternate ? '- <em>(Dự khuyết)</em>' : ''}</div>`
      )
      .join('');
  }

  // Format defendants (Bị can/Bị cáo)
  const defendants = caseItem.litigants.filter(
    (l) => l.role === 'BI_CAN' || l.role === 'BI_CAO'
  );
  let defendantsHtml = '';
  if (defendants.length > 0) {
    defendantsHtml = defendants
      .map(
        (b) =>
          `<div>- Họ và tên: <strong>${b.name}</strong> ${
            b.birthYear ? `(Sinh năm: ${b.birthYear})` : ''
          }; ${b.identityNo ? `CCCD/CMND: ${b.identityNo}; ` : ''}Trú tại: ${
            b.address || 'Không rõ'
          }${b.detentionStatus ? ` - <em>[${b.detentionStatus}]</em>` : ''}</div>`
      )
      .join('');
  } else {
    defendantsHtml = `<div>- ${caseItem.title}</div>`;
  }

  // Format plaintiffs (Nguyên đơn / Người khởi kiện)
  const plaintiffs = caseItem.litigants.filter(
    (l) => l.role === 'NGUYEN_DON' || l.role === 'NGUOI_KHOI_KIEN'
  );
  let plaintiffsHtml = '';
  if (plaintiffs.length > 0) {
    plaintiffsHtml = plaintiffs
      .map(
        (p) =>
          `<div>- Nguyên đơn: <strong>${p.name}</strong> ${
            p.birthYear ? `(SN: ${p.birthYear})` : ''
          }; Địa chỉ: ${p.address || 'Không rõ'}</div>`
      )
      .join('');
  }

  // Format defendants in civil (Bị đơn / Người bị kiện)
  const civilDefendants = caseItem.litigants.filter(
    (l) => l.role === 'BI_DON' || l.role === 'NGUOI_BI_KIEN'
  );
  let civilDefendantsHtml = '';
  if (civilDefendants.length > 0) {
    civilDefendantsHtml = civilDefendants
      .map(
        (b) =>
          `<div>- Bị đơn: <strong>${b.name}</strong> ${
            b.birthYear ? `(SN: ${b.birthYear})` : ''
          }; Địa chỉ: ${b.address || 'Không rõ'}</div>`
      )
      .join('');
  }

  // Format victims (Người bị hại)
  const victims = caseItem.litigants.filter((l) => l.role === 'NGUOI_BI_HAI');
  let victimsHtml = '';
  if (victims.length > 0) {
    victimsHtml = victims
      .map(
        (v) =>
          `<div>- Người bị hại: <strong>${v.name}</strong> ${
            v.birthYear ? `(SN: ${v.birthYear})` : ''
          }; Trú tại: ${v.address || 'Không rõ'}</div>`
      )
      .join('');
  }

  // Format all litigants
  let allLitigantsHtml = caseItem.litigants
    .map(
      (l) =>
        `<div>- <strong>${l.roleName}:</strong> ${l.name} ${
          l.birthYear ? `(SN: ${l.birthYear})` : ''
        } - Địa chỉ: ${l.address || 'Chưa cập nhật'}</div>`
    )
    .join('');
  if (!allLitigantsHtml) {
    allLitigantsHtml = `<div>${caseItem.title}</div>`;
  }

  // Preventive measure info
  const activePm = caseItem.preventiveMeasures.find((pm) => pm.status !== 'HUY_BO');
  const detentionDuration = activePm
    ? `từ ngày ${formatDateVN(activePm.effectiveFrom)} đến ngày ${formatDateVN(activePm.effectiveTo)}`
    : '30 (ba mươi) ngày';
  const detentionEndDate = activePm ? formatDateVN(activePm.effectiveTo) : formatDateVN(caseItem.deadlineDate);

  // Decision No
  const decisionNumber = customDecisionNo || `${caseItem.decisions.length + 1}/2026/QĐ-TA`;

  const mapReplacements: Record<string, string> = {
    '{{TEN_TOA_AN}}': settings.courtName,
    '{{TINH_THANH}}': settings.province,
    '{{DIA_CHI_TOA_AN}}': settings.address,
    '{{SO_DIEN_THOAI}}': settings.phone,
    '{{SO_QUYET_DINH}}': decisionNumber,
    '{{NGAY_BAN_HANH}}': formatDateFormalVN(caseItem.assignmentDate || '2026-06-27'),
    '{{SO_THU_LY}}': caseItem.docketNumber,
    '{{NGAY_THU_LY}}': formatDateFormalVN(caseItem.intakeDate),
    '{{MA_VU_VIEC}}': caseItem.caseCode,
    '{{TEN_VU_AN}}': caseItem.title,
    '{{TOI_DANH_HOAC_TRANH_CHAP}}': caseItem.disputeOrCrime,
    '{{CAN_CU_PHAP_LY}}': caseItem.prosecutionDocument || 'Đơn khởi kiện và các tài liệu kèm theo',
    '{{THAM_PHAN}}': caseItem.assignedJudgeName || '[Chưa phân công Thẩm phán]',
    '{{NGACH_THAM_PHAN}}': caseItem.assignedJudgeTitle || 'Thẩm phán',
    '{{THAM_PHAN_DU_KHUYET}}': caseItem.alternateJudgeName || 'Không',
    '{{THU_KY}}': caseItem.assignedClerkName || '[Chưa phân công Thư ký]',
    '{{THU_KY_DU_KHUYET}}': caseItem.alternateClerkName || 'Không',
    '{{HOI_THAM_NHAN_DAN}}': jurorsHtml,
    '{{CHANH_AN}}': settings.chiefJudgeName,
    '{{PHO_CHANH_AN}}': settings.deputyChiefJudgeName,
    '{{BI_CAN_BI_CAO}}': defendantsHtml,
    '{{NGUYEN_DON}}': plaintiffsHtml || 'Không',
    '{{BI_DON}}': civilDefendantsHtml || 'Không',
    '{{NGUOI_BI_HAI}}': victimsHtml || 'Không',
    '{{DUONG_SU}}': allLitigantsHtml,
    '{{THOI_HAN_TAM_GIAM}}': detentionDuration,
    '{{NGAY_HET_HAN_TAM_GIAM}}': detentionEndDate,
  };

  Object.entries(mapReplacements).forEach(([tag, val]) => {
    // Replace all instances of tag
    content = content.split(tag).join(val);
  });

  return content;
}
