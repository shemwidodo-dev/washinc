export function getAllSales(req, res) {
  res.json({ message: "Laporan penjualan sementara", by: req.user });
}
