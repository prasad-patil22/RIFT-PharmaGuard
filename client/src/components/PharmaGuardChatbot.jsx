
import { useState, useEffect, useRef } from "react";
import {
  FaRobot,
  FaTimes,
  FaCompress,
  FaUser,
  FaShieldAlt,
  FaDna,
  FaPills,
  FaClipboardCheck,
} from "react-icons/fa";

const API_KEY = process.env.REACT_APP_API_KEY;

const API_URL =
  process.env.REACT_APP_GROQ_API_URL



  console.log(API_KEY,"      ",API_URL);
const PharmaGuardChatbot = ({ analysisData = null }) => {
    const normalizedAnalysis = Array.isArray(analysisData)
  ? analysisData
  : analysisData?.analyses
    ? analysisData.analyses
    : analysisData
      ? [analysisData]
      : null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const viewportHeight = useRef(window.innerHeight);
  const tooltipTimeout = useRef(null);

  // Quick action buttons - Pharmacogenomics focused
  const quickActions = [
    {
      id: 1,
      label: "Risk Assessment",
      icon: <FaShieldAlt size={16} />,
      question: "What is the overall risk level for this patient?",
      gradient: "linear-gradient(135deg, #4F6AF5 0%, #3A4FD0 100%)",
    },
    {
      id: 2,
      label: "Gene Profile",
      icon: <FaDna size={16} />,
      question: "What are the detected genes and their phenotypes?",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    },
    {
      id: 3,
      label: "Drug Metabolism",
      icon: <FaPills size={16} />,
      question: "How will this patient metabolize the drug?",
      gradient: "linear-gradient(135deg, #4F6AF5 0%, #3A4FD0 100%)",
    },
    {
      id: 4,
      label: "Recommendations",
      icon: <FaClipboardCheck size={16} />,
      question: "What are the clinical recommendations?",
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
    },
  ];

  const PHARMAGUARD_CONTEXT = (data) => `
You are PharmaGuard Clinical Explainable AI Assistant.

You MUST answer ONLY about the provided pharmacogenomic analysis report(s).
If multiple drugs are present, answer clearly per drug.


STRICT RULES:
- Answer ONLY based on provided analysis JSON.
- Do NOT give general medical advice.
- Do NOT answer unrelated questions.
- If question is outside scope, reply:
  "I can only answer questions related to this patient's pharmacogenomic report."

PATIENT ANALYSIS JSON:
${JSON.stringify(data, null, 2)}
`;

  // Detect mobile and keyboard visibility
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      viewportHeight.current = window.innerHeight;
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleResize = () => {
      if (isMobile) {
        const heightDiff = Math.abs(viewportHeight.current - window.innerHeight);
        setKeyboardVisible(heightDiff > 100);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  // Handle tooltip timing
  const handleMouseEnter = () => {
    if (!isMobile) {
      tooltipTimeout.current = setTimeout(() => {
        setShowTooltip(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
    }
    setShowTooltip(false);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isMinimized]);

  // Only render if analysisData exists
  if (!normalizedAnalysis || normalizedAnalysis.length === 0) return null;


  const sendMessage = async (messageContent = input) => {
    if ((!messageContent.trim() && !input.trim()) || loading) return;

    const userMessage = { role: "user", content: messageContent };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setShowWelcome(false);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: PHARMAGUARD_CONTEXT(normalizedAnalysis),

            },
            ...updatedMessages,
          ],
          temperature: 0.2,
          max_tokens: 512,
        }),
      });

      if (!res.ok) throw new Error("Groq request failed");

      const data = await res.json();
      const botReply = data.choices[0].message.content;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: botReply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickAction = (question) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setTimeout(() => {
      inputRef.current?.focus();
      scrollToBottom();
    }, 100);
  };

  if (isMinimized) {
    return (
      <div
        style={styles.minimizedContainer}
        onClick={() => setIsMinimized(false)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={styles.minimizedContent}>
          <FaRobot style={styles.minimizedIcon} />
          <span style={styles.minimizedText}>Ask about analysis</span>
        </div>
        {showTooltip && !isMobile && (
          <div style={styles.minimizedTooltip}>
            Click to expand chat
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Floating Avatar */}
      {!isOpen && (
        <div
          style={styles.avatarContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 300);
          }}
        >
          <div style={styles.avatar}>
            <FaRobot style={styles.avatarIcon} />
          </div>
          {showTooltip && !isMobile && (
            <div style={styles.speechBubble}>
              Ask me about this analysis
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          style={{
            ...(isMobile ? styles.mobileChatContainer : styles.chatContainer),
            ...(isMobile && keyboardVisible && styles.keyboardOpen),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.chatWrapper}>
            {/* Header */}
            <div style={styles.chatHeader}>
              <div style={styles.headerLeft}>
                <div style={styles.avatarCircle}>
                  <FaRobot style={styles.headerIcon} />
                </div>
                <div style={styles.headerText}>
                  <h3 style={styles.headerTitle}>PharmaGuard AI Assistant</h3>
                  <p style={styles.headerSubtitle}>
                    Pharmacogenomic Analysis & Recommendations
                  </p>
                </div>
              </div>
              <div style={styles.headerActions}>
                <button
                  onClick={() => setIsMinimized(true)}
                  style={styles.iconButton}
                  aria-label="Minimize"
                >
                  <FaCompress size={14} />
                </button>
                <button
                  onClick={clearChat}
                  style={styles.iconButton}
                  aria-label="Clear chat"
                  title="Clear chat"
                >
                  <span style={styles.clearIcon}>🗑️</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={styles.iconButton}
                  aria-label="Close"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div style={styles.messagesContainer}>
              {showWelcome && messages.length === 0 && (
                <div style={styles.welcomeMessage}>
                  <div style={styles.botMessageWrapper}>
                    <div style={styles.messageAvatar}>
                      <FaRobot style={styles.botAvatarIcon} />
                    </div>
                    <div style={styles.botMessage}>
                      <div style={styles.messageHeader}>
                        <span style={styles.roleLabel}>AI Assistant</span>
                      </div>
                      <div style={styles.messageText}>
                        <p style={styles.messageParagraph}>
                          Hello! I'm your pharmacogenomics AI assistant. Ask me about:
                        </p>
                        <ul style={styles.welcomeList}>
                          <li>Risk assessment and severity</li>
                          <li>Gene profiles and phenotypes</li>
                          <li>Drug metabolism predictions</li>
                          <li>Clinical recommendations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={
                    msg.role === "user"
                      ? styles.userMessageWrapper
                      : styles.botMessageWrapper
                  }
                >
                  {msg.role === "assistant" && (
                    <div style={styles.messageAvatar}>
                      <FaRobot style={styles.botAvatarIcon} />
                    </div>
                  )}
                  <div
                    style={
                      msg.role === "user"
                        ? styles.userMessage
                        : styles.botMessage
                    }
                  >
                    <div style={styles.messageHeader}>
                      <span style={msg.role === "user" ? styles.userRoleLabel : styles.roleLabel}>
                        {msg.role === "user" ? "You" : "AI Assistant"}
                      </span>
                    </div>
                    <div style={styles.messageText}>
                      {msg.content.split("\n").map((line, idx) => (
                        <p key={idx} style={styles.messageParagraph}>
                          {line || "\u00A0"}
                        </p>
                      ))}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div style={styles.messageAvatar}>
                      <FaUser style={styles.userAvatarIcon} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={styles.botMessageWrapper}>
                  <div style={styles.messageAvatar}>
                    <FaRobot style={styles.botAvatarIcon} />
                  </div>
                  <div style={styles.botMessage}>
                    <div style={styles.typingContainer}>
                      <div style={styles.typingIndicator}>
                        <span style={styles.typingDot}></span>
                        <span style={styles.typingDot} styles={{ animationDelay: "0.2s" }}></span>
                        <span style={styles.typingDot} styles={{ animationDelay: "0.4s" }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Buttons - Hidden on mobile keyboard */}
            {!(isMobile && keyboardVisible) && (
              <div style={styles.quickActionsContainer}>
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.question)}
                    style={styles.quickActionButton}
                    disabled={loading}
                    title={action.question}
                  >
                    <span style={styles.quickActionIcon}>{action.icon}</span>
                    <span style={styles.quickActionLabel}>{action.label}</span>
                    <span style={{
                      ...styles.quickActionGradient,
                      background: action.gradient,
                    }} />
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div style={styles.inputContainer}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about this pharmacogenomic analysis..."
                style={styles.input}
                disabled={loading}
                aria-label="Message input"
              />
              <button
                onClick={() => sendMessage()}
                style={{
                  ...styles.sendButton,
                  opacity: loading || !input.trim() ? 0.6 : 1,
                  pointerEvents: loading || !input.trim() ? "none" : "auto",
                }}
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                {loading ? (
                  <span style={styles.sendButtonLoading}>...</span>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideOut {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }

        * {
          box-sizing: border-box;
        }

        button {
          cursor: pointer;
          border: none;
          outline: none;
          padding: 0;
          margin: 0;
        }

        input {
          outline: none;
          border: none;
        }

        /* Prevent zoom on iOS */
        @media (max-width: 768px) {
          input, button {
            font-size: 16px;
          }
        }

        /* Safe area for iOS */
        @supports (padding: max(0px)) {
          .chat-wrapper {
            padding-bottom: max(0px, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
};

const styles = {
  // Floating Avatar
  avatarContainer: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    zIndex: 10000,
    cursor: "pointer",
    animation: "float 4s ease-in-out infinite",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "36px",
    background: "linear-gradient(145deg, #4F6AF5 0%, #8B5CF6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    boxShadow: "0 12px 32px -8px rgba(79, 106, 245, 0.4)",
    border: "3px solid #fff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },
  avatarIcon: {
    width: "32px",
    height: "32px",
  },
  speechBubble: {
    position: "absolute",
    bottom: "calc(100% + 12px)",
    right: "0",
    padding: "12px 20px",
    borderRadius: "20px 20px 4px 20px",
    background: "#fff",
    boxShadow: "0 12px 28px -8px rgba(0, 0, 0, 0.15)",
    color: "#1A1F36",
    fontSize: "15px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    animation: "fadeIn 0.2s ease-out",
    border: "1px solid rgba(226, 232, 240, 0.6)",
    letterSpacing: "-0.01em",
  },

  // Minimized State
  minimizedContainer: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    zIndex: 10000,
    cursor: "pointer",
    animation: "float 4s ease-in-out infinite",
  },
  minimizedContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 24px",
    borderRadius: "40px",
    background: "linear-gradient(145deg, #4F6AF5 0%, #8B5CF6 100%)",
    color: "#fff",
    boxShadow: "0 12px 28px -8px rgba(79, 106, 245, 0.4)",
    border: "2px solid #fff",
    transition: "transform 0.2s ease",
  },
  minimizedIcon: {
    width: "20px",
    height: "20px",
  },
  minimizedText: {
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  minimizedTooltip: {
    position: "absolute",
    bottom: "calc(100% + 12px)",
    right: "0",
    padding: "10px 18px",
    borderRadius: "16px 16px 4px 16px",
    background: "#fff",
    boxShadow: "0 8px 20px -6px rgba(0, 0, 0, 0.12)",
    color: "#1A1F36",
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    animation: "fadeIn 0.2s ease-out",
    border: "1px solid #E2E8F0",
  },

  // Chat Container
  chatContainer: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    width: "400px",
    height: "650px",
    maxHeight: "calc(100vh - 100px)",
    zIndex: 10000,
    animation: "fadeInScale 0.2s ease-out",
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  mobileChatContainer: {
    position: "fixed",
    inset: "0",
    zIndex: 10000,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "flex-end",
    animation: "fadeIn 0.2s ease-out",
  },
  keyboardOpen: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  chatWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "24px 24px 0 0",
    overflow: "hidden",
    boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.12)",
    maxHeight: "100%",
  },

  // Header
  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: "linear-gradient(145deg, #F8FAFF 0%, #F5F3FF 100%)",
    borderBottom: "1px solid #E2E8F0",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  avatarCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #4F6AF5 0%, #8B5CF6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 10px -2px rgba(79, 106, 245, 0.3)",
  },
  headerIcon: {
    width: "20px",
    height: "20px",
    color: "#fff",
  },
  headerText: {
    minWidth: 0,
    flex: 1,
  },
  headerTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#1A1F36",
    fontFamily: "system-ui, -apple-system, sans-serif",
    letterSpacing: "-0.02em",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  headerSubtitle: {
    margin: "2px 0 0 0",
    fontSize: "11px",
    color: "#4A5568",
    fontFamily: "system-ui, -apple-system, sans-serif",
    opacity: 0.8,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  headerActions: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: "8px",
  },
  iconButton: {
    width: "34px",
    height: "34px",
    borderRadius: "17px",
    background: "rgba(255, 255, 255, 0.8)",
    border: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4A5568",
    fontSize: "14px",
    transition: "all 0.2s ease",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  clearIcon: {
    fontSize: "14px",
    lineHeight: 1,
  },

  // Messages Area
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: "#FFFFFF",
    scrollBehavior: "smooth",
  },
  welcomeMessage: {
    marginBottom: "4px",
  },
  welcomeList: {
    margin: "8px 0 0 0",
    paddingLeft: "20px",
    color: "#334155",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  // Message Layout
  botMessageWrapper: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    maxWidth: "85%",
    animation: "slideOut 0.2s ease-out",
  },
  userMessageWrapper: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
    maxWidth: "85%",
    animation: "slideIn 0.2s ease-out",
  },

  // Message Bubbles
  botMessage: {
    background: "#F8FAFC",
    padding: "12px 16px",
    borderRadius: "20px 20px 20px 6px",
    maxWidth: "100%",
    wordBreak: "break-word",
    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
    border: "1px solid #EDF2F7",
  },
  userMessage: {
    background: "linear-gradient(135deg, #4F6AF5 0%, #6B46C1 100%)",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "20px 20px 6px 20px",
    maxWidth: "100%",
    wordBreak: "break-word",
    boxShadow: "0 4px 12px rgba(79, 106, 245, 0.2)",
  },

  // Message Content
  messageAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "16px",
    background: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "4px",
    border: "1px solid #E2E8F0",
  },
  botAvatarIcon: {
    color: "#4F6AF5",
    width: "16px",
    height: "16px",
  },
  userAvatarIcon: {
    color: "#6B46C1",
    width: "16px",
    height: "16px",
  },
  messageHeader: {
    marginBottom: "6px",
  },
  roleLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#4F6AF5",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    background: "#EEF2FF",
    padding: "2px 8px",
    borderRadius: "12px",
    display: "inline-block",
  },
  userRoleLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    background: "rgba(255, 255, 255, 0.2)",
    padding: "2px 8px",
    borderRadius: "12px",
    display: "inline-block",
  },
  messageText: {
    fontSize: "14px",
    lineHeight: "1.5",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  messageParagraph: {
    margin: "0 0 6px 0",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    "&:last-child": {
      marginBottom: 0,
    },
  },

  // Typing Indicator
  typingContainer: {
    padding: "4px 8px",
  },
  typingIndicator: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  typingDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "4px",
    background: "#4F6AF5",
    animation: "typing 1.4s infinite ease-in-out",
  },

  // Quick Action Buttons
  quickActionsContainer: {
    display: "flex",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#F8FAFC",
    borderTop: "1px solid #EDF2F7",
    borderBottom: "1px solid #EDF2F7",
    overflowX: "auto",
    flexShrink: 0,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  quickActionButton: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "40px",
    border: "none",
    backgroundColor: "#FFFFFF",
    color: "#1A1F36",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "system-ui, -apple-system, sans-serif",
    letterSpacing: "-0.01em",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    flexShrink: 0,
    boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
    overflow: "hidden",
  },
  quickActionIcon: {
    position: "relative",
    zIndex: 1,
    color: "inherit",
  },
  quickActionLabel: {
    position: "relative",
    zIndex: 1,
  },
  quickActionGradient: {
    position: "absolute",
    inset: 0,
    opacity: 0.1,
    transition: "opacity 0.2s ease",
    zIndex: 0,
  },

  // Input Area
  inputContainer: {
    display: "flex",
    gap: "10px",
    padding: "16px 20px",
    backgroundColor: "#FFFFFF",
    borderTop: "1px solid #EDF2F7",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "28px",
    border: "2px solid #E2E8F0",
    fontSize: "15px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#F8FAFC",
    transition: "border-color 0.2s ease, background-color 0.2s ease",
    "&:focus": {
      borderColor: "#4F6AF5",
      backgroundColor: "#FFFFFF",
    },
    "&:disabled": {
      backgroundColor: "#F1F5F9",
      cursor: "not-allowed",
    },
  },
  sendButton: {
    padding: "14px 28px",
    borderRadius: "28px",
    background: "linear-gradient(135deg, #4F6AF5 0%, #6B46C1 100%)",
    color: "#fff",
    border: "none",
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "system-ui, -apple-system, sans-serif",
    letterSpacing: "-0.01em",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 12px rgba(79, 106, 245, 0.2)",
    minWidth: "80px",
  },
  sendButtonLoading: {
    opacity: 0.7,
  },
};

export default PharmaGuardChatbot;