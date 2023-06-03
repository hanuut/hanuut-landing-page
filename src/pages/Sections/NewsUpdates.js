import styled from 'styled-components';

const NewsSection = styled.section`
  background-color: #fff;
  padding: 50px;
`;

const NewsTitle = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const NewsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NewsItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const NewsDate = styled.span`
  font-size: 16px;
  color: #666;
  margin-right: 20px;
`;

const NewsText = styled.p`
  font-size: 18px;
  color: #666;
  line-height: 1.5;
`;

function NewsUpdates() {
  return (
    <NewsSection>
      <NewsTitle>News and Updates</NewsTitle>
<NewsList>
<NewsItem>
<NewsDate>May 1, 2023</NewsDate>
<NewsText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat diam vel quam pulvinar, ac gravida sapien facilisis.</NewsText>
</NewsItem>
<NewsItem>
<NewsDate>April 15, 2023</NewsDate>
<NewsText>Nullam non leo in tortor fermentum fringilla. Suspendisse potenti. Donec et quam eget justo ultricies bibendum at vel ipsum.</NewsText>
</NewsItem>
<NewsItem>
<NewsDate>March 28, 2023</NewsDate>
<NewsText>Suspendisse et metus molestie, finibus sem in, vestibulum lorem. Nunc non orci vitae erat efficitur porta.</NewsText>
</NewsItem>
</NewsList>
</NewsSection>
);
}

export default NewsUpdates;