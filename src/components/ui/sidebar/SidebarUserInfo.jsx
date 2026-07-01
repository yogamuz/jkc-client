import { useRef, useCallback, useState } from "react";
import { Camera } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { uploadAvatar } from "../../../services/authService";
import { useSidebarColors } from "./SidebarTokens";
import CropAvatarModal from "./CropAvatarModal";

const SidebarUserInfo = ({ user, onAvatarUpdate }) => {
  const C = useSidebarColors();
  const [cropModal, setCropModal] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result);
      setCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onImageLoad = useCallback((e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    setCrop(
      centerCrop(
        makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
        width,
        height,
      ),
    );
  }, []);

  const handleCropConfirm = async () => {
    if (!completedCrop || !imgRef.current) return;
    setAvatarLoading(true);
    try {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const size = 200;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        size,
        size,
      );
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9),
      );
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const data = await uploadAvatar(file);
      onAvatarUpdate?.(data.avatar);
      setCropModal(false);
      setImgSrc("");
    } catch (err) {
      console.error("Upload gagal:", err.message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleCropCancel = () => {
    setCropModal(false);
    setImgSrc("");
  };

  return (
    <>
      <div
        style={{
          padding: "0.875rem 1.25rem",
          borderBottom: `1px solid ${C.border}`,
          background: C.bgPanel,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: "0.55rem",
            color: C.muted,
            fontWeight: 700,
            letterSpacing: "2.5px",
            fontFamily: "'Courier New', monospace",
            marginBottom: "8px",
          }}
        >
          LOGGED IN AS
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Avatar */}
          <div
            onClick={() => !avatarLoading && fileInputRef.current?.click()}
            style={{
              position: "relative",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `1.5px solid ${C.border}`,
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: `1.5px solid ${C.border}`,
                  background: C.bgHover,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 900,
                  color: C.text,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {(user?.username || "A")[0].toUpperCase()}
              </div>
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
            >
              <Camera size={12} color="#fff" strokeWidth={2} />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Username + role */}
          <div>
            <div
              style={{
                fontSize: "0.88rem",
                color: C.text,
                fontWeight: 900,
                fontFamily: "'Courier New', monospace",
                letterSpacing: "-0.5px",
              }}
            />
            <div
              style={{
                display: "inline-block",
                marginTop: "4px",
                padding: "2px 8px",
                background: "transparent",
                color: C.yellow,
                fontSize: "0.55rem",
                fontWeight: 900,
                letterSpacing: "2px",
                border: `1px solid ${C.yellow}`,
                fontFamily: "'Courier New', monospace",
              }}
            >
              {user?.role?.toUpperCase() || "ADMIN"}
            </div>
          </div>
        </div>
      </div>

      {cropModal && (
        <CropAvatarModal
          imgSrc={imgSrc}
          imgRef={imgRef}
          crop={crop}
          setCrop={setCrop}
          onImageLoad={onImageLoad}
          onComplete={(c) => setCompletedCrop(c)}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
          loading={avatarLoading}
        />
      )}
    </>
  );
};

export default SidebarUserInfo;