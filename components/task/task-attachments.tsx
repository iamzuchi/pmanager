"use client";

import { File } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";

interface TaskAttachmentsProps {
  attachments: File[];
}

export const TaskAttachments = ({ attachments }: TaskAttachmentsProps) => {
  return (
    <Card className="shadow-lg border border-muted w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Attachments</CardTitle>
      </CardHeader>

      <CardContent>
        {attachments.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map((file) => (
              <div key={file.id} className="relative group cursor-pointer">
                <Image
                  src={file.type === "PDF" ? "/pdf.png" : file.url}
                  alt="attachment"
                  width={80}
                  height={120}
                  className="w-full h-48 object-contain rounded-lg"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground h-20 flex items-center">No attachments found</p>
        )}
      </CardContent>
    </Card>
  );
};
