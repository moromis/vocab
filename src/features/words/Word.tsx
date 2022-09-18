export const Word = ({
  name,
  definition,
}: {
  name: string;
  definition: string;
}) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{definition}</td>
    </tr>
  );
};
