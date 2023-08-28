import styled from 'styled-components';

const TestimonialsSection = styled.section`
  background-color: #fff;
  padding: 50px;
`;

const TestimonialsTitle = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const TestimonialCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const TestimonialText = styled.p`
  font-size: 18px;
  color: #666;
  line-height: 1.5;
  text-align: center;
`;

const TestimonialAuthor = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
`;

function Testimonials() {
  return (
    <TestimonialsSection>
      <TestimonialsTitle>Testimonials</TestimonialsTitle>
      <TestimonialCard>
        <TestimonialText>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat diam vel quam pulvinar, ac gravida sapien facilisis."
        </TestimonialText>
        <TestimonialAuthor>John Doe, CEO</TestimonialAuthor>
      </TestimonialCard>
      <TestimonialCard>
        <TestimonialText>
          "Nullam non leo in tortor fermentum fringilla. Suspendisse potenti. Donec et quam eget justo ultricies bibendum at vel ipsum."
        </TestimonialText>
        <TestimonialAuthor>Jane Smith, Creative Director</TestimonialAuthor>
      </TestimonialCard>
      <TestimonialCard>
        <TestimonialText>
          "Suspendisse et metus molestie, finibus sem in, vestibulum lorem. Nunc non orci vitae erat efficitur porta."
        </TestimonialText>
        <TestimonialAuthor>Mike Johnson, Marketing Manager</TestimonialAuthor>
      </TestimonialCard>
    </TestimonialsSection>
  );
}

export default Testimonials;