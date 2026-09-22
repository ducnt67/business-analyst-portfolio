import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import TrangDangNhap from '../modules/XacThuc/pages/TrangDangNhap';
import DanhSachKyDanhGia from '../modules/KyDanhGia/pages/DanhSachKyDanhGia';
import ChiTietKyDanhGia from '../modules/KyDanhGia/pages/ChiTietKyDanhGia';
import DanhSachViPham from '../modules/ViPham/pages/DanhSachViPham';
import TrangChu from '../modules/TrangChu/pages/TrangChu';
import TrangCongViecCaNhan from '../modules/CaNhan/pages/TrangCongViecCaNhan';
import DanhSachTuDanhGia from '../modules/CaNhan/pages/DanhSachTuDanhGia';
import ChiTietTuDanhGia from '../modules/CaNhan/pages/ChiTietTuDanhGia';
import DanhSachKyDuyet from '../modules/TruongDonVi/pages/DanhSachKyDuyet';
import DanhSachNhanVienDuyet from '../modules/TruongDonVi/pages/DanhSachNhanVienDuyet';
import ChiTietDuyetNhanVien from '../modules/TruongDonVi/pages/ChiTietDuyetNhanVien';
import TrangTongHopDanhGia from '../modules/TruongDonVi/pages/TrangTongHopDanhGia';
import TrangKetQuaDanhGia from '../modules/TruongDonVi/pages/TrangKetQuaDanhGia';
import DanhSachKyDanhGiaLanhDao from '../modules/PhoGiamDoc/pages/DanhSachKyDanhGiaLanhDao';
import DanhSachLanhDaoDanhGia from '../modules/PhoGiamDoc/pages/DanhSachLanhDaoDanhGia';
import ChiTietDanhGiaLanhDao from '../modules/PhoGiamDoc/pages/ChiTietDanhGiaLanhDao';
import DanhSachDuyetTongThe from '../modules/GiamDoc/pages/DanhSachDuyetTongThe';
import ChiTietDuyetTongThe from '../modules/GiamDoc/pages/ChiTietDuyetTongThe';
import DanhSachKyBaoCao from '../modules/BaoCao/pages/DanhSachKyBaoCao';
import TrangChuBaoCao from '../modules/BaoCao/pages/TrangChuBaoCao';
import TrangTongHopBaoCao from '../modules/BaoCao/pages/TrangTongHopBaoCao';
import PrivateRoute from './PrivateRoute';
import IndexRedirect from './IndexRedirect';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dang-nhap" element={<TrangDangNhap />} />

      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<IndexRedirect />} />
        <Route path="trang-chu" element={<TrangChu />} />
        <Route path="cong-viec-ca-nhan" element={<TrangCongViecCaNhan />} />
        <Route path="tu-danh-gia" element={<DanhSachTuDanhGia />} />
        <Route path="tu-danh-gia/:id" element={<ChiTietTuDanhGia />} />
        <Route path="ket-qua-lanh-dao" element={<TrangKetQuaDanhGia />} />
        <Route path="ky-danh-gia" element={<DanhSachKyDanhGia />} />
        <Route path="ky-danh-gia/:id" element={<ChiTietKyDanhGia />} />
        <Route path="vi-pham" element={<DanhSachViPham />} />

        <Route path="duyet-cbgv" element={<DanhSachKyDuyet />} />
        <Route path="duyet-cbgv/:periodId" element={<DanhSachNhanVienDuyet />} />
        <Route path="duyet-cbgv/:periodId/staff/:staffId" element={<ChiTietDuyetNhanVien />} />
        <Route path="duyet-cbgv/:periodId/summary" element={<TrangTongHopDanhGia />} />

        <Route path="danh-gia-lanh-dao" element={<DanhSachKyDanhGiaLanhDao />} />
        <Route path="danh-gia-lanh-dao/:periodId" element={<DanhSachLanhDaoDanhGia />} />
        <Route path="danh-gia-lanh-dao/:periodId/leader/:leaderId" element={<ChiTietDanhGiaLanhDao />} />

        <Route path="duyet-tong-the" element={<DanhSachDuyetTongThe />} />
        <Route path="duyet-tong-the/:periodId" element={<ChiTietDuyetTongThe />} />

        <Route path="bao-cao" element={<DanhSachKyBaoCao />} />
        <Route path="bao-cao/:periodId/trang-chu" element={<TrangChuBaoCao />} />
        <Route path="bao-cao/:periodId/summary" element={<TrangTongHopBaoCao />} />

        <Route path="*" element={<div>Page Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
