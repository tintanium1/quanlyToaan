import { CaseStatus, CaseType, CourtCase, CourtUnitSettings } from '../types/court';

export function formatDateVN(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateFormalVN(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return 'ngày ... tháng ... năm ...';
  return `ngày ${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
}

export function getDaysRemaining(deadlineDateStr: string): {
  days: number;
  isOverdue: boolean;
  isWarning: boolean; // còn <= 10 ngày
  displayText: string;
} {
  const target = new Date(deadlineDateStr);
  const today = new Date('2026-06-27'); // reference date within app context (2026)
  
  if (isNaN(target.getTime())) {
    return { days: 0, isOverdue: false, isWarning: false, displayText: 'Chưa xác định' };
  }

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: Math.abs(diffDays),
      isOverdue: true,
      isWarning: false,
      displayText: `Quá hạn ${Math.abs(diffDays)} ngày`,
    };
  }

  if (diffDays <= 10) {
    return {
      days: diffDays,
      isOverdue: false,
      isWarning: true,
      displayText: `Còn ${diffDays} ngày (Sắp hết hạn)`,
    };
  }

  return {
    days: diffDays,
    isOverdue: false,
    isWarning: false,
    displayText: `Còn ${diffDays} ngày`,
  };
}

export function getCaseTypeName(type: CaseType): string {
  switch (type) {
    case 'HINH_SU':
      return 'Hình sự';
    case 'DAN_SU':
      return 'Dân sự';
    case 'HON_NHAN':
      return 'Hôn nhân & Gia đình';
    case 'KDTM':
      return 'Kinh doanh, Thương mại';
    case 'HANH_CHINH':
      return 'Hành chính';
    case 'LAO_DONG':
      return 'Lao động';
    case 'PHA_SAN':
      return 'Phá sản';
    default:
      return type;
  }
}

export function getStatusBadge(status: CaseStatus): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  switch (status) {
    case 'MOI_THU_LY':
      return {
        label: 'Mới thụ lý',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-700',
        borderClass: 'border-blue-200',
      };
    case 'DA_PHAN_CONG':
      return {
        label: 'Đã phân công',
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-700',
        borderClass: 'border-purple-200',
      };
    case 'DANG_CHUAN_BI_XET_XU':
      return {
        label: 'Đang chuẩn bị xét xử',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-800',
        borderClass: 'border-amber-200',
      };
    case 'GIA_HAN':
      return {
        label: 'Gia hạn chuẩn bị XX',
        bgClass: 'bg-orange-50',
        textClass: 'text-orange-700',
        borderClass: 'border-orange-200',
      };
    case 'DA_CO_QUYET_DINH':
      return {
        label: 'Đã có QĐ xét xử',
        bgClass: 'bg-indigo-50',
        textClass: 'text-indigo-700',
        borderClass: 'border-indigo-200',
      };
    case 'DA_TUYEN_AN':
      return {
        label: 'Đã tuyên án',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        borderClass: 'border-emerald-200',
      };
    case 'DA_GIAI_QUYET':
      return {
        label: 'Đã giải quyết xong',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-800',
        borderClass: 'border-emerald-200',
      };
    case 'TAM_DINH_CHI':
      return {
        label: 'Tạm đình chỉ',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-700',
        borderClass: 'border-gray-300',
      };
    case 'DINH_CHI':
      return {
        label: 'Đình chỉ giải quyết',
        bgClass: 'bg-rose-50',
        textClass: 'text-rose-700',
        borderClass: 'border-rose-200',
      };
    default:
      return {
        label: 'Đang theo dõi',
        bgClass: 'bg-gray-50',
        textClass: 'text-gray-700',
        borderClass: 'border-gray-200',
      };
  }
}

// Generate printable HTML content for official court documents
export function generateAssignmentDecisionHtml(c: CourtCase, settings: CourtUnitSettings): string {
  const jurorsText = c.assignedJurors.length > 0
    ? c.assignedJurors.map((j, i) => `${i + 1}. Ông/Bà: <strong>${j.name}</strong>${j.organization ? ` (${j.organization})` : ''}${j.isAlternate ? ' - Hội thẩm dự khuyết' : ' - Hội thẩm chính thức'}`).join('<br>')
    : 'Chưa chỉ định Hội thẩm nhân dân';

  const litigantsText = c.litigants.map(l => `- ${l.roleName}: <strong>${l.name}</strong>${l.birthYear ? ` (SN: ${l.birthYear})` : ''}, trú tại: ${l.address}`).join('<br>');

  return `
  <div style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.45; padding: 25px; max-width: 800px; margin: auto;">
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="width: 45%; vertical-align: top; text-align: center;">
          <div style="font-weight: bold; font-size: 13pt;">${settings.courtName.toUpperCase()}</div>
          <div style="font-size: 11pt;">Số: ${c.decisions.find(d => d.decisionType === 'QUYET_DINH_PHAN_CONG')?.decisionNo || '.../2026/QĐ-PC-TA'}</div>
        </td>
        <td style="width: 55%; vertical-align: top; text-align: center;">
          <div style="font-weight: bold; font-size: 12pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div style="font-weight: bold; font-size: 12pt; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</div>
          <div style="font-style: italic; font-size: 11pt; margin-top: 6px;">${settings.province}, ${formatDateFormalVN(c.assignmentDate || c.intakeDate)}</div>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 25px 0 15px 0;">
      <div style="font-weight: bold; font-size: 15pt;">QUYẾT ĐỊNH</div>
      <div style="font-weight: bold; font-size: 13pt;">Về việc phân công Thẩm phán, Thư ký, Hội thẩm nhân dân<br>giải quyết vụ án ${getCaseTypeName(c.caseType).toLowerCase()}</div>
    </div>

    <div style="text-align: center; font-weight: bold; font-size: 13pt; margin-bottom: 15px;">
      CHÁNH ÁN ${settings.courtName.toUpperCase()}
    </div>

    <div style="font-size: 12pt; text-align: justify; margin-bottom: 12px;">
      <em>- Căn cứ Bộ luật Tố tụng ${c.caseType === 'HINH_SU' ? 'Hình sự số 101/2015/QH13' : (c.caseType === 'HANH_CHINH' ? 'Hành chính số 93/2015/QH13' : 'Dân sự số 92/2015/QH13')};</em><br>
      <em>- Căn cứ Luật Tổ chức Tòa án nhân dân;</em><br>
      <em>- Căn cứ hồ sơ vụ án ${getCaseTypeName(c.caseType).toLowerCase()} thụ lý số <strong>${c.docketNumber}</strong> ngày ${formatDateVN(c.intakeDate)};</em><br>
      <em>- Xét đề nghị của Văn phòng Tòa án về việc phân công người tiến hành tố tụng,</em>
    </div>

    <div style="text-align: center; font-weight: bold; font-size: 13pt; margin: 15px 0 10px 0;">
      QUYẾT ĐỊNH:
    </div>

    <div style="font-size: 12pt; text-align: justify; line-height: 1.6;">
      <p><strong>Điều 1.</strong> Phân công người tiến hành tố tụng giải quyết vụ án: <strong>${c.title}</strong>, gồm các đương sự / bị can:</p>
      <div style="padding-left: 20px; margin-bottom: 10px;">
        ${litigantsText}
      </div>
      <p style="margin-bottom: 8px;"><strong>1. Thẩm phán giải quyết vụ án:</strong></p>
      <div style="padding-left: 20px; margin-bottom: 10px;">
        - Thẩm phán chủ tọa phiên tòa: <strong>${c.assignedJudgeName || '................................'}</strong> (${c.assignedJudgeTitle || 'Thẩm phán'})<br>
        - Thẩm phán dự khuyết (nếu có): <strong>${c.alternateJudgeName || 'Không'}</strong>
      </div>

      <p style="margin-bottom: 8px;"><strong>2. Thư ký Tòa án:</strong></p>
      <div style="padding-left: 20px; margin-bottom: 10px;">
        - Thư ký phiên tòa: <strong>${c.assignedClerkName || '................................'}</strong> (Thư ký TAND)<br>
        - Thư ký dự khuyết (nếu có): <strong>${c.alternateClerkName || 'Không'}</strong>
      </div>

      <p style="margin-bottom: 8px;"><strong>3. Hội thẩm nhân dân tham gia Hội đồng xét xử:</strong></p>
      <div style="padding-left: 20px; margin-bottom: 10px;">
        ${jurorsText}
      </div>

      <p><strong>Điều 2.</strong> Các ông, bà có tên tại Điều 1 chịu trách nhiệm thực hiện đầy đủ nhiệm vụ, quyền hạn theo quy định của pháp luật tố tụng trong suốt quá trình giải quyết vụ án.</p>
      <p><strong>Điều 3.</strong> Quyết định này có hiệu lực kể từ ngày ký. Các đơn vị nghiệp vụ, Thẩm phán, Thư ký, Hội thẩm nhân dân có tên nêu trên chịu trách nhiệm thi hành Quyết định này./.</p>
    </div>

    <table style="width: 100%; margin-top: 30px; font-size: 11pt;">
      <tr>
        <td style="width: 50%; vertical-align: top;">
          <strong><em>Nơi nhận:</em></strong><br>
          - Viện kiểm sát nhân dân cùng cấp;<br>
          - Các Thẩm phán, Thư ký, Hội thẩm có tên;<br>
          - Đương sự / Bị can;<br>
          - Lưu: Hồ sơ vụ án, VT-TA.
        </td>
        <td style="width: 50%; vertical-align: top; text-align: center;">
          <div style="font-weight: bold; font-size: 12pt;">CHÁNH ÁN</div>
          <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
          <div style="height: 70px; display: flex; align-items: center; justify-content: center;">
            <span style="border: 2px solid #b91c1c; color: #b91c1c; padding: 4px 10px; font-weight: bold; font-size: 11pt; border-radius: 4px; transform: rotate(-5deg); display: inline-block;">
              ĐÃ KÝ & ĐÓNG DẤU TAND
            </span>
          </div>
          <div style="font-weight: bold; font-size: 12pt; margin-top: 5px;">${c.assignmentSigner || settings.chiefJudgeName}</div>
        </td>
      </tr>
    </table>
  </div>
  `;
}

// Generate printable HTML content for Warrant of Detention (Lệnh tạm giam)
export function generateDetentionWarrantHtml(c: CourtCase, settings: CourtUnitSettings): string {
  const accused = c.litigants.find(l => l.role === 'BI_CAN' || l.role === 'BI_CAO') || c.litigants[0];
  const detentionMeasure = c.preventiveMeasures.find(pm => pm.type === 'TAM_GIAM' || pm.type === 'BAT_TAM_GIAM');

  return `
  <div style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.45; padding: 25px; max-width: 800px; margin: auto;">
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="width: 45%; vertical-align: top; text-align: center;">
          <div style="font-weight: bold; font-size: 12pt;">${settings.courtName.toUpperCase()}</div>
          <div style="font-size: 11pt;">Số: ${detentionMeasure?.decisionNo || '.../2026/LTG-TA'}</div>
        </td>
        <td style="width: 55%; vertical-align: top; text-align: center;">
          <div style="font-weight: bold; font-size: 12pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div style="font-weight: bold; font-size: 12pt; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</div>
          <div style="font-style: italic; font-size: 11pt; margin-top: 6px;">${settings.province}, ${formatDateFormalVN(detentionMeasure?.issuedDate)}</div>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 25px 0 15px 0;">
      <div style="font-weight: bold; font-size: 16pt;">LỆNH TẠM GIAM</div>
    </div>

    <div style="text-align: center; font-weight: bold; font-size: 13pt; margin-bottom: 15px;">
      CHÁNH ÁN / THẨM PHÁN CHỦ TỌA PHIÊN TÒA ${settings.courtName.toUpperCase()}
    </div>

    <div style="font-size: 12pt; text-align: justify; margin-bottom: 12px;">
      <em>- Căn cứ các điều 44, 45, 119 và Điều 278 Bộ luật Tố tụng Hình sự số 101/2015/QH13;</em><br>
      <em>- Căn cứ hồ sơ vụ án hình sự thụ lý số <strong>${c.docketNumber}</strong> ngày ${formatDateVN(c.intakeDate)};</em><br>
      <em>- Xét thấy cần tiếp tục tạm giam bị cáo để bảo đảm việc xét xử và thi hành án,</em>
    </div>

    <div style="text-align: center; font-weight: bold; font-size: 13pt; margin: 15px 0 10px 0;">
      RA LỆNH:
    </div>

    <div style="font-size: 12pt; text-align: justify; line-height: 1.6;">
      <p><strong>Điều 1.</strong> Tạm giam đối với bị can/bị cáo:</p>
      <div style="padding-left: 20px; margin-bottom: 10px;">
        - Họ và tên: <strong>${accused?.name || '................................'}</strong>; Giới tính: Nam/Nữ<br>
        - Sinh năm: ${accused?.birthYear || '......'}; Số CCCD: ${accused?.identityNo || '........................'}<br>
        - Nơi ĐKHKTT và chỗ ở hiện nay: ${accused?.address || '................................'}<br>
        - Bị Viện kiểm sát truy tố về: <em>${c.disputeOrCrime}</em>
      </div>

      <p><strong>Điều 2.</strong> Thời hạn tạm giam là: <strong>30 ngày</strong>, kể từ ngày ${formatDateVN(detentionMeasure?.effectiveFrom || '2026-06-12')} đến hết ngày ${formatDateVN(detentionMeasure?.effectiveTo || '2026-07-12')}.</p>
      <p>- Nơi tạm giam: Trại tạm giam Công an tỉnh Đắk Lắk.</p>
      <p><strong>Điều 3.</strong> Ban Giám thị Trại tạm giam Công an tỉnh và Cơ quan Cảnh sát điều tra, bị cáo có tên tại Điều 1 chịu trách nhiệm thi hành Lệnh này./.</p>
    </div>

    <table style="width: 100%; margin-top: 30px; font-size: 11pt;">
      <tr>
        <td style="width: 50%; vertical-align: top;">
          <strong><em>Nơi nhận:</em></strong><br>
          - VKSND cùng cấp;<br>
          - Trại tạm giam Công an tỉnh;<br>
          - Bị cáo, gia đình bị cáo;<br>
          - Lưu: Hồ sơ vụ án, VT-TA.
        </td>
        <td style="width: 50%; vertical-align: top; text-align: center;">
          <div style="font-weight: bold; font-size: 12pt;">THẨM PHÁN CHỦ TỌA PHIÊN TÒA</div>
          <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
          <div style="height: 70px; display: flex; align-items: center; justify-content: center;">
            <span style="border: 2px solid #b91c1c; color: #b91c1c; padding: 4px 10px; font-weight: bold; font-size: 11pt; border-radius: 4px; transform: rotate(-5deg); display: inline-block;">
              ĐÃ DUYỆT & KÝ BAN HÀNH
            </span>
          </div>
          <div style="font-weight: bold; font-size: 12pt; margin-top: 5px;">${c.assignedJudgeName || settings.chiefJudgeName}</div>
        </td>
      </tr>
    </table>
  </div>
  `;
}

// Generate printable HTML content for Decision to bring case to trial (Quyết định đưa vụ án ra xét xử)
export function generateTrialDecisionHtml(c: CourtCase, settings: CourtUnitSettings): string {
  const trialDec = c.decisions.find(d => d.decisionType === 'DUA_VU_AN_RA_XET_XU');
  const litigantsText = c.litigants.map(l => `- ${l.roleName}: <strong>${l.name}</strong>${l.birthYear ? ` (SN: ${l.birthYear})` : ''}, trú tại: ${l.address}`).join('<br>');

  return `
  <div style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.45; padding: 25px; max-width: 800px; margin: auto;">
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <td style="width: 45%; vertical-align: top; text-align: center;">
          <div style="font-weight: bold; font-size: 12pt;">${settings.courtName.toUpperCase()}</div>
          <div style="font-size: 11pt;">Số: ${trialDec?.decisionNo || '01/2026/QĐXXST-HS'}</div>
        </td>
        <td style="width: 55%; vertical-align: top; text-align: center;">
          <div style="font-weight: bold; font-size: 12pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div style="font-weight: bold; font-size: 12pt; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</div>
          <div style="font-style: italic; font-size: 11pt; margin-top: 6px;">${settings.province}, ${formatDateFormalVN(trialDec?.issuedDate)}</div>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin: 25px 0 15px 0;">
      <div style="font-weight: bold; font-size: 15pt;">QUYẾT ĐỊNH</div>
      <div style="font-weight: bold; font-size: 13pt;">ĐƯA VỤ ÁN RA XÉT XỬ SƠ THẨM</div>
    </div>

    <div style="text-align: center; font-weight: bold; font-size: 13pt; margin-bottom: 15px;">
      TÒA ÁN NHÂN DÂN KHU VỰC 12 - TỈNH ĐẮK LẮK
    </div>

    <div style="font-size: 12pt; text-align: justify; margin-bottom: 12px;">
      <em>- Căn cứ các điều 45, 255 và Điều 277 Bộ luật Tố tụng Hình sự;</em><br>
      <em>- Căn cứ Cáo trạng số <strong>${c.prosecutionDocument || '24/CT-VKS-KV12'}</strong>;</em><br>
      <em>- Sau khi nghiên cứu hồ sơ vụ án hình sự sơ thẩm thụ lý số <strong>${c.docketNumber}</strong> ngày ${formatDateVN(c.intakeDate)},</em>
    </div>

    <div style="text-align: center; font-weight: bold; font-size: 13pt; margin: 15px 0 10px 0;">
      QUYẾT ĐỊNH:
    </div>

    <div style="font-size: 12pt; text-align: justify; line-height: 1.6;">
      <p><strong>I. Đưa ra xét xử sơ thẩm công khai vụ án hình sự đối với:</strong></p>
      <div style="padding-left: 20px; margin-bottom: 10px;">
        ${litigantsText}
      </div>

      <p><strong>II. Thời gian và địa điểm mở phiên tòa:</strong></p>
      <div style="padding-left: 20px; margin-bottom: 10px;">
        - Thời gian mở phiên tòa: Vào hồi <strong>${trialDec?.trialDate ? trialDec.trialDate.split(' ')[1] : '08 giờ 00'} phút</strong>, ngày <strong>${formatDateVN(trialDec?.trialDate ? trialDec.trialDate.split(' ')[0] : '2026-07-06')}</strong>.<br>
        - Địa điểm: Tại <strong>${trialDec?.trialLocation || 'Hội trường xét xử số 1 - TAND khu vực 12, tỉnh Đắk Lắk'}</strong>.
      </div>

      <p><strong>III. Những người tiến hành tố tụng:</strong></p>
      <div style="padding-left: 20px; margin-bottom: 10px;">
        - Thẩm phán - Chủ tọa phiên tòa: <strong>${c.assignedJudgeName || 'Võ Thị Tuyết Trinh'}</strong><br>
        - Các Hội thẩm nhân dân: <strong>${c.assignedJurors.filter(j => !j.isAlternate).map(j => j.name).join(', ') || 'Lê Thị Mai, Chu Ngọc Thạch'}</strong><br>
        - Thư ký phiên tòa: <strong>${c.assignedClerkName || 'Trần Thanh Uyên'}</strong><br>
        - Đại diện Viện kiểm sát tham gia phiên tòa: Kiểm sát viên VKSND khu vực 12.
      </div>
    </div>

    <table style="width: 100%; margin-top: 30px; font-size: 11pt;">
      <tr>
        <td style="width: 50%; vertical-align: top;">
          <strong><em>Nơi nhận:</em></strong><br>
          - VKSND cùng cấp;<br>
          - Bị cáo, người bị hại, đương sự;<br>
          - Người bào chữa (nếu có);<br>
          - Lưu: Hồ sơ vụ án, VT-TA.
        </td>
        <td style="width: 50%; vertical-align: top; text-align: center;">
          <div style="font-weight: bold; font-size: 12pt;">THẨM PHÁN CHỦ TỌA PHIÊN TÒA</div>
          <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
          <div style="height: 70px; display: flex; align-items: center; justify-content: center;">
            <span style="border: 2px solid #b91c1c; color: #b91c1c; padding: 4px 10px; font-weight: bold; font-size: 11pt; border-radius: 4px; transform: rotate(-5deg); display: inline-block;">
              ĐÃ KÝ DUYỆT PHÁT HÀNH
            </span>
          </div>
          <div style="font-weight: bold; font-size: 12pt; margin-top: 5px;">${c.assignedJudgeName || settings.chiefJudgeName}</div>
        </td>
      </tr>
    </table>
  </div>
  `;
}

// Download content as a formatted .doc file with UTF-8 BOM to prevent Vietnamese mojibake
export function exportToWordDoc(htmlContent: string, fileName: string) {
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>${fileName}</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      @page {
        size: 210mm 297mm;
        margin: 20mm 20mm 20mm 25mm; /* Chuẩn thể thức văn bản: lề trái 2.5cm, các lề còn lại 2cm */
      }
      body {
        font-family: 'Times New Roman', 'Times', serif;
        font-size: 13pt;
        line-height: 1.45;
        color: #000;
        text-align: justify;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      p {
        margin: 6pt 0;
      }
    </style>
  </head>
  <body>`;
  const footer = `</body></html>`;
  // \uFEFF is the UTF-8 Byte Order Mark (BOM) needed by Microsoft Word to properly decode UTF-8 Vietnamese accents
  const blob = new Blob(['\uFEFF' + header + htmlContent + footer], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Print specific HTML element content with proper font rendering
export function printHtmlContent(htmlContent: string, title: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap&subset=vietnamese" rel="stylesheet">
        <style>
          @page { size: A4; margin: 20mm 15mm 20mm 20mm; }
          body { 
            font-family: 'Times New Roman', 'Lora', 'Merriweather', serif; 
            font-size: 12.5pt; 
            line-height: 1.45; 
            color: #000; 
            margin: 0; 
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          table { width: 100%; border-collapse: collapse; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }, 250);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
