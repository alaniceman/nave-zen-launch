import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageCircle, ChevronDown, ChevronUp, RefreshCw, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatConversation {
  id: string;
  session_id: string;
  messages: ChatMessage[];
  ip_address: string | null;
  message_count: number;
  first_user_message: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminChatLogs() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: conversations, isLoading, refetch } = useQuery({
    queryKey: ["chat-conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as unknown as ChatConversation[];
    },
  });

  const filtered = conversations?.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    if (c.first_user_message?.toLowerCase().includes(q)) return true;
    return c.messages?.some((m) => m.content?.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chat Logs — Nave AI</h1>
          <p className="text-muted-foreground text-sm">
            Últimas 100 conversaciones del chatbot
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar en conversaciones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : !filtered?.length ? (
        <p className="text-muted-foreground">
          {search ? "No se encontraron conversaciones." : "No hay conversaciones aún."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((conv) => {
            const isExpanded = expandedId === conv.id;
            const userMessages = conv.messages?.filter((m) => m.role === "user") || [];
            return (
              <Card key={conv.id} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer py-3 px-4"
                  onClick={() => setExpandedId(isExpanded ? null : conv.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <MessageCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {conv.first_user_message || "Sin mensaje"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(conv.updated_at), "dd MMM yyyy HH:mm", { locale: es })}
                          {conv.ip_address && ` · IP: ${conv.ip_address}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {userMessages.length} msg usuario
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0 px-4 pb-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {conv.messages?.map((msg, i) => (
                        <div
                          key={i}
                          className={`text-sm p-2 rounded-lg ${
                            msg.role === "user"
                              ? "bg-primary/10 text-foreground ml-8"
                              : "bg-muted text-foreground mr-8"
                          }`}
                        >
                          <span className="font-semibold text-xs uppercase text-muted-foreground">
                            {msg.role === "user" ? "Usuario" : "Nave AI"}
                          </span>
                          {msg.role === "assistant" ? (
                            <div className="mt-1 prose prose-sm max-w-none [&_p]:m-0 [&_ul]:my-1 [&_li]:my-0 [&_a]:text-primary [&_a]:underline">
                              <ReactMarkdown
                                components={{
                                  a: ({ href, children }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                      {children}
                                    </a>
                                  ),
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="mt-1 whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
