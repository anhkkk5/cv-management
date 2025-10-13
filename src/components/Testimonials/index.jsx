import React from "react";
import { Rate, Avatar, Carousel, Spin } from "antd";
import "./style.css";

function Testimonials() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [candidatesRes, expRes, projRes] = await Promise.all([
          fetch("http://localhost:3002/Candidates"),
          fetch("http://localhost:3002/Experience_Candidate"),
          fetch("http://localhost:3002/Project_Candidate"),
        ]);
        const [candidates, experiences, projects] = await Promise.all([
          candidatesRes.json(),
          expRes.json(),
          projRes.json(),
        ]);

        const candidateIdToExp = {};
        (experiences || []).forEach((ex) => {
          candidateIdToExp[ex.candidate_id] = ex;
        });

        const candidateIdToQuote = {};
        (projects || []).forEach((p) => {
          if (!candidateIdToQuote[p.candidate_id]) {
            candidateIdToQuote[p.candidate_id] = p.info || p.name;
          }
        });

        const normalized = (candidates || []).map((c) => {
          const ex = candidateIdToExp[c.id];
          const displayRole = ex ? ex.position : "Professional";
          const displayQuote =
            candidateIdToQuote[c.id] ||
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra.";
          const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            c.name || "User"
          )}`;
          return {
            id: c.id,
            name: c.name,
            role: displayRole,
            quote: displayQuote,
            avatar: avatarUrl,
          };
        });

        setItems(normalized.slice(0, 9));
      } catch (error) {
        console.error('Testimonials fetch error:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fallback = React.useMemo(
    () => [
      {
        id: "f1",
        name: "Robert Fox",
        role: "UI/UX Designer",
        quote:
          "Ut ullamcorper hendrerit tempor. Aliquam in rutrum dui. Maecenas ac placerat metus, in faucibus est.",
        avatar:
          "https://api.dicebear.com/7.x/initials/svg?seed=Robert%20Fox",
      },
      {
        id: "f2",
        name: "Bessie Cooper",
        role: "Creative Director",
        quote:
          "Mauris eget lorem odio. Mauris convallis justo molestie metus aliquam lacinia.",
        avatar:
          "https://api.dicebear.com/7.x/initials/svg?seed=Bessie%20Cooper",
      },
      {
        id: "f3",
        name: "Jane Cooper",
        role: "Photographer",
        quote:
          "Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Jane%20Cooper",
      },
    ],
    []
  );

  const data = items.length ? items : fallback;

  const toChunks = (arr, size) =>
    arr.reduce((acc, _, i) => (i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc), []);

  const slides = toChunks(data, 3);

  return (
    <div className="testimonials-section">
      <h2 className="testimonials-title">Clients Testimonial</h2>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : (
        <Carousel autoplay className="testimonials-carousel">
          {slides.map((group, idx) => (
            <div key={idx}>
              <div className="testimonials-row">
                {group.map((t) => (
                  <div className="testimonial-card" key={t.id}>
                    <Rate disabled defaultValue={5} className="testimonial-stars" />
                    <p className="testimonial-quote">{t.quote}</p>
                    <div className="testimonial-author">
                      <Avatar src={t.avatar} size={48} />
                      <div>
                        <div className="testimonial-name">{t.name}</div>
                        <div className="testimonial-role">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
}

export default Testimonials;
