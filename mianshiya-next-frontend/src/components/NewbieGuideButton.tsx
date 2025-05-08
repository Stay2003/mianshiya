"use client";
import { useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function NewbieGuideButton() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 100,
          left: 32,
          zIndex: 1001,
        }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <button
          style={{
            background: "#1677ff",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 48,
            height: 48,
            boxShadow: "0 2px 8px rgba(22,119,255,0.15)",
            fontSize: 24,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="新手引导"
        >
          <QuestionCircleOutlined />
        </button>
        {show && (
          <div
            style={{
              position: "absolute",
              top: 56,
              left: 0,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(22,119,255,0.13)",
              padding: 20,
              minWidth: 260,
              maxWidth: 320,
              fontSize: 15,
              color: "#333",
              zIndex: 1002,
            }}
          >
            <div style={{ fontWeight: 600, color: "#1677ff", marginBottom: 8 }}>
              新手引导
            </div>
            <div style={{ marginBottom: 10 }}>
              欢迎来到刷题鸭！这里有丰富的题库和活跃的社区，助你高效刷题、提升技能。
            </div>
            <ul style={{ paddingLeft: 18, color: "#888", fontSize: 14, marginBottom: 12 }}>
              <li>如何开始刷题？</li>
              <li>如何收藏/管理题目？</li>
              <li>如何查看刷题记录？</li>
            </ul>
            <div style={{ textAlign: "center" }}>
              <a
                href="/guide"
                style={{ color: "#1677ff", fontWeight: 500, cursor: "pointer" }}
                onClick={e => {
                  e.preventDefault();
                  router.push("/guide");
                }}
              >
                查看新人指引 &gt;
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 