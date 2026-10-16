import React, { useState } from 'react';
import { CourtUnitSettings } from '../types/court';
import { X, Save, Building } from 'lucide-react';

interface CourtSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CourtUnitSettings;
  onSaveSettings: (newSettings: CourtUnitSettings) => void;
}

export const CourtSettingsModal: React.FC<CourtSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const [courtName, setCourtName] = useState(settings.courtName);
  const [courtDistrict, setCourtDistrict] = useState(settings.courtDistrict);
  const [province, setProvince] = useState(settings.province);
  const [chiefJudgeName, setChiefJudgeName] = useState(settings.chiefJudgeName);
  const [deputyChiefJudgeName, setDeputyChiefJudgeName] = useState(settings.deputyChiefJudgeName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      courtName: courtName.trim(),
      courtDistrict: courtDistrict.trim(),
      province: province.trim(),
      chiefJudgeName: chiefJudgeName.trim(),
      deputyChiefJudgeName: deputyChiefJudgeName.trim(),
      address: address.trim(),
      phone: phone.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#991B1B] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base uppercase">Cấu Hình Đơn Vị Tòa Án Nhân Dân</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Tên Tòa án đầy đủ <span className="text-red-600">(*)</span>
            </label>
            <input
              type="text"
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              placeholder="VD: TÒA ÁN NHÂN DÂN KHU VỰC 12 - ĐẮK LẮK"
              className="w-full border border-slate-300 rounded px-3 py-1.5 font-bold uppercase focus:ring-1 focus:ring-red-600 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Quận / Huyện / Khu vực</label>
              <input
                type="text"
                value={courtDistrict}
                onChange={(e) => setCourtDistrict(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tỉnh / Thành phố trực thuộc TW</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Họ tên Chánh án <span className="text-red-600">(*)</span>
              </label>
              <input
                type="text"
                value={chiefJudgeName}
                onChange={(e) => setChiefJudgeName(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5 font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Họ tên Phó Chánh án</label>
              <input
                type="text"
                value={deputyChiefJudgeName}
                onChange={(e) => setDeputyChiefJudgeName(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-1.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Trụ sở cơ quan</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-1.5"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Điện thoại liên hệ</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-1.5"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white border border-slate-300 rounded text-slate-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-[#991B1B] text-white rounded font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
