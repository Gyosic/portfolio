"use client";

import { Database, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DocFile {
  name: string;
  size: number;
  updatedAt: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function EmbeddingButton() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ message: string; count?: number } | null>(null);
  const [files, setFiles] = useState<DocFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of Array.from(selected)) {
        formData.append("files", file);
      }
      const res = await fetch("/api/documents", { method: "POST", body: formData });
      if (res.ok) {
        await fetchFiles();
      }
    } catch { /* ignore */ }
    finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (name: string) => {
    try {
      const res = await fetch("/api/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.name !== name));
      }
    } catch { /* ignore */ }
  };

  const handleEmbed = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/embeddings", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setResult({ message: data.error || "임베딩 생성에 실패했습니다." });
        return;
      }

      setResult({ message: data.message, count: data.count });
    } catch {
      setResult({ message: "요청 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="size-5" />
          챗봇 임베딩
        </CardTitle>
        <CardDescription>
          포트폴리오 데이터를 AI 챗봇에 반영합니다. 문서를 업로드하고 임베딩을 실행해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* File Upload */}
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.md,.txt"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <><Loader2 className="size-4 animate-spin" /> 업로드 중...</>
            ) : (
              <><Upload className="size-4" /> 문서 업로드 (PDF, MD, TXT)</>
            )}
          </Button>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-xs">업로드된 문서 ({files.length})</p>
            <div className="max-h-40 overflow-y-auto rounded-md border">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between gap-2 border-b px-3 py-2 last:border-b-0"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate text-sm">{file.name}</span>
                    <span className="shrink-0 text-muted-foreground text-xs">
                      {formatSize(file.size)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0"
                    onClick={() => handleDelete(file.name)}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Embed Button */}
        <Button onClick={handleEmbed} disabled={loading} className="w-full">
          {loading ? (
            <><Loader2 className="size-4 animate-spin" /> 처리 중...</>
          ) : (
            "임베딩 실행"
          )}
        </Button>
        {result && (
          <p className={`text-sm ${result.count != null ? "text-green-600" : "text-destructive"}`}>
            {result.message}
            {result.count != null && ` (${result.count}건)`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
