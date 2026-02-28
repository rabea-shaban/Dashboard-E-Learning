import { useEffect, useState } from "react";
import { Award, Download, Share2, Calendar, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { purchaseService } from "../services/purchase.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StudentCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      try {
        const purchases = await purchaseService.getUserPurchases(user.uid);
        
        // Generate certificates for completed courses
        const certs = purchases.flatMap((purchase: any) =>
          purchase.courses?.map((course: any) => ({
            id: `${purchase.id}-${course.courseId}`,
            courseName: course.title,
            instructor: course.instructor,
            completionDate: purchase.purchaseDate,
            studentName: user.displayName || "Student",
            certificateNumber: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            image: course.image,
          })) || []
        );
        
        setCertificates(certs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [user]);

  const handleDownload = async (cert: any, format: 'png' | 'pdf' = 'png') => {
    try {
      // SVG as data URL
      const svgIcon = `data:image/svg+xml;base64,${btoa(`
        <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 70 L30 95 L40 85 L50 95 L50 70 Z" fill="#9333ea"/>
          <path d="M50 70 L50 95 L60 85 L70 95 L70 70 Z" fill="#7c3aed"/>
          <circle cx="50" cy="45" r="30" fill="#fbbf24" stroke="#f59e0b" stroke-width="3"/>
          <circle cx="50" cy="45" r="24" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
          <path d="M50 30 L53 40 L63 40 L55 46 L58 56 L50 50 L42 56 L45 46 L37 40 L47 40 Z" fill="#f59e0b"/>
          <path d="M45 45 L48 50 L56 40" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>
      `)}`;

      // Create temporary A4 certificate
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '1122px';
      tempDiv.style.height = '794px';
      tempDiv.style.background = '#f3e7ff';
      tempDiv.style.border = '8px solid #c084fc';
      tempDiv.style.padding = '80px';
      tempDiv.style.display = 'flex';
      tempDiv.style.alignItems = 'center';
      tempDiv.style.justifyContent = 'center';
      
      tempDiv.innerHTML = `
        <div style="text-align: center; width: 100%;">
          <div style="margin-bottom: 30px;">
            <img src="${svgIcon}" width="120" height="120" style="margin: 0 auto; display: block;" />
          </div>
          <h3 style="font-size: 36px; font-weight: bold; margin-bottom: 20px; color: #1f2937; letter-spacing: 2px;">
            CERTIFICATE OF COMPLETION
          </h3>
          <div style="width: 100px; height: 3px; background: linear-gradient(to right, transparent, #9333ea, transparent); margin: 0 auto 24px;"></div>
          <p style="font-size: 18px; margin-bottom: 24px; color: #4b5563; font-style: italic;">
            This is to certify that
          </p>
          <p style="font-size: 42px; font-weight: bold; margin-bottom: 24px; color: #9333ea; text-transform: uppercase; letter-spacing: 1px;">
            ${cert.studentName}
          </p>
          <p style="font-size: 18px; margin-bottom: 20px; color: #4b5563;">
            has successfully completed the course
          </p>
          <p style="font-size: 32px; font-weight: bold; margin-bottom: 32px; color: #1f2937;">
            ${cert.courseName}
          </p>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; margin-bottom: 32px; color: #4b5563;">
            <span>📅</span>
            <span style="font-weight: 600;">Date: ${new Date(cert.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div style="border-top: 2px solid #c084fc; padding-top: 16px; margin-top: 24px;">
            <p style="font-size: 14px; color: #6b7280; letter-spacing: 1px;">
              Certificate ID: ${cert.certificateNumber}
            </p>
          </div>
        </div>
      `;
      
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      document.body.removeChild(tempDiv);

      if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
        pdf.save(`Certificate-${cert.courseName.replace(/[^a-z0-9]/gi, '-')}.pdf`);
      } else {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificate-${cert.courseName.replace(/[^a-z0-9]/gi, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleShare = (cert: any) => {
    alert(`Sharing certificate for ${cert.courseName}`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Certificates</h1>
        <p className="text-gray-600">View and download your earned certificates</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Award size={32} />
            <div>
              <p className="text-sm opacity-90">Total Certificates</p>
              <p className="text-3xl font-bold">{certificates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={32} />
            <div>
              <p className="text-sm opacity-90">Completed Courses</p>
              <p className="text-3xl font-bold">{certificates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={32} />
            <div>
              <p className="text-sm opacity-90">This Month</p>
              <p className="text-3xl font-bold">
                {certificates.filter((c) => {
                  const date = new Date(c.completionDate);
                  const now = new Date();
                  return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                  );
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Award size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Certificates Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Complete courses to earn certificates
          </p>
          <a
            href="/student/browse"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
            >
              {/* Certificate Preview */}
              <div
                className="relative p-8 border-4"
                style={{
                  background: '#f3e7ff',
                  borderColor: '#c084fc'
                }}
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
                      {/* Ribbon */}
                      <path d="M30 70 L30 95 L40 85 L50 95 L50 70 Z" fill="#9333ea"/>
                      <path d="M50 70 L50 95 L60 85 L70 95 L70 70 Z" fill="#7c3aed"/>
                      {/* Medal Circle */}
                      <circle cx="50" cy="45" r="30" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3"/>
                      <circle cx="50" cy="45" r="24" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2"/>
                      {/* Star */}
                      <path d="M50 30 L53 40 L63 40 L55 46 L58 56 L50 50 L42 56 L45 46 L37 40 L47 40 Z" fill="#f59e0b"/>
                      {/* Checkmark */}
                      <path d="M45 45 L48 50 L56 40" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#1f2937' }}>
                    Certificate of Completion
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#4b5563' }}>
                    This certifies that
                  </p>
                  <p className="text-xl font-bold mb-4" style={{ color: '#9333ea' }}>
                    {cert.studentName}
                  </p>
                  <p className="text-sm mb-2" style={{ color: '#4b5563' }}>
                    has successfully completed
                  </p>
                  <p className="text-lg font-bold mb-4" style={{ color: '#1f2937' }}>
                    {cert.courseName}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm mb-4" style={{ color: '#4b5563' }}>
                    <span>📅</span>
                    <span>
                      {new Date(cert.completionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: '#6b7280' }}>
                    Certificate No: {cert.certificateNumber}
                  </p>
                </div>
              </div>

              {/* Certificate Info */}
              <div className="p-4 bg-white">
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Instructor</p>
                  <p className="font-semibold text-gray-800">
                    {cert.instructor}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(cert, 'png')}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium text-sm"
                  >
                    <Download size={16} />
                    PNG
                  </button>
                  <button
                    onClick={() => handleDownload(cert, 'pdf')}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium text-sm"
                  >
                    <Download size={16} />
                    PDF
                  </button>
                  <button
                    onClick={() => handleShare(cert)}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;
