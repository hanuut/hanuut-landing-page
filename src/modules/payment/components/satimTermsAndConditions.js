import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
const TermsAndConditions = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  padding: 1rem;
  margin: 0 auto;
  width: 75%;
  font-size: ${(props) => props.theme.fontlg};
  line-height: 1.5;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  overflow: auto; /* Add this line to handle overflow */
  @media (max-width: 768px) {
    width: 85%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const TermsHeading = styled.h1`
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: bold;
  margin: 2rem 0;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxl};
    margin: 1rem 0;
  }
`;

const TermsSubHeading = styled.h2`
  text-transform: capitalized;
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: bold;
  margin-bottom: 8px;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const TermsParagraph = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  margin-bottom: 10px;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const List = styled.ul`
  margin-bottom: 10px;
  list-style-type: none;
`;

const ListItem = styled.li`
  margin-left: 20px;
  list-style-type: none;
`;

const SatimTermsAndConditions = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <TermsHeading>{t("testPaymentTerms")}</TermsHeading>
      {i18n.language === "fr" ? (
        <TermsAndConditions>
          <TermsHeading>
            {" "}
            Conditions Spécifiques d’utilisation du paiement en ligne{" "}
          </TermsHeading>
          <TermsSubHeading>Préambule</TermsSubHeading>
          <TermsParagraph>
            Les présentes conditions spécifiques d’utilisation du paiement en
            ligne via la carte EDAHABIA ou les cartes CIB, ciaprès « CSU:
            Conditions Spécifiques d'Utilisation » s’appliquent sur l'ensemble
            des transactions en ligne établies sur le site www.hanuut.com ou
            notre application mobile Hanuut Customer Toute utilisation du
            service paiement en ligne via la carte EDAHABIA sur ce site, suppose
            l’acceptation préalable et sans réserve par l’E-consommateur des
            présentes CSU.
          </TermsParagraph>
          <TermsSubHeading>1. Objet</TermsSubHeading>
          <TermsParagraph>
            Les présentes CSU, ont pour objet de définir les conditions et
            modalités selon lesquelles Hanuut Express propose au E-consommateur
            détenteur d’une Carte EDAHABIA ou les cartes CIB, l’utilisation du
            service paiement en ligne sur son site www.hanuut.com ou sa
            application mobile Hanuut Customer
          </TermsParagraph>

          <TermsSubHeading>2. Définitions</TermsSubHeading>
          <TermsParagraph>
            En application des présentes conditions spécifiques d’utilisation,
            il est entendu par :
          </TermsParagraph>
          <List>
            <ListItem>
              <TermsParagraph>
                2.1 COMMANDE : est le moyen par lequel l’e-consommateur s’engage
                à acheter en ligne des services vendus par l’E-FOURNISSEUR, qui
                s’engage à son tour de les délivrer conformément aux
                dispositions législatives et règlementaires en vigueur.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.2 E-FOURNISSEUR : SARL HANUUT EXPRESS qui propose la
                fourniture par voie électronique des services définis dans les
                présentes CSU.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.3 E-consommateur : Toute personne physique ou morale qui
                acquiert un service par voie de communication électronique
                auprès de l’E-FOURNISSEUR pour une utilisation finale.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.4 Site marchand : est la boutique virtuelle des services en
                ligne du E-FOURNISSEUR.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.5 CARTE MONETIQUE D’ALGERIE POSTE OU LES CARTES CIB: Cartes
                monétique adossée à un Compte Courant Postal ou bancaire,
                conforme aux normes requises, constituant un moyen de paiement
                autorisé permettant d’effectuer des transactions par voie
                électronique.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.6 CONDITIONS SPECIFIQUE D’UTILISATION « CSU » : L’ensemble des
                règles affichées sur le site marchand d’e-fournisseur régissant
                l’utilisation du service de paiement électronique accepté par l’
                econsommateur.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.7 PAIEMENT ELECTRONIQUE : Service qui permet au titulaire de
                la carte MONETIQUE D’ALGERIE POSTE Eddahabia, en sa qualité
                d’e-consommateur, d’effectuer des transactions de paiement de
                services, sur le site marchand du E-FOURNISSEUR.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>
            3. Les conditions spécifiques d’utilisation du service paiement en
            ligne sont :
          </TermsSubHeading>
          <TermsParagraph>
            En cochant la case d'acceptation des conditions lors du processus
            d'achat, le client confirme son acceptation sans réserve des
            présentes conditions de vente.
          </TermsParagraph>

          <ListItem>
            <TermsParagraph>
              -L’accès au service est réservé aux détenteurs de la Carte
              Monétique d’Algérie Poste EDAHABIA ou les cartes CIB ayant le
              droit de son usage sur le site de paiement en ligne de Hanuut
              Express ou son application mobile et jouissant de la capacité
              juridique. D'une manière générale, cela signifie que tout individu
              doit avoir 19 ans révolus pour devenir E-consommateur et commander
              sur le site www.hanuut.com ou l'application mobile Hanuut
              Customer.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - l’E-consommateur doit fournir l’ensemble des informations
              requises avant la validation de sa commande, après sélection du
              service ou du produit, il sera ajouté dans le reçu de paiement.
              Lorsque les choix des produits ou services sont terminés la
              commande est validée, ensuite, il sera demandé au E-consommateur
              de s’authentifier avec un mot de passe.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - le E-consommateur est seul responsable des erreurs de saisie,
              notamment celles concernant le numéro bénéficiaire du paiement en
              ligne, et par conséquent, il assumera la totale responsabilité.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - le E-consommateur peut annuler sa commande sans aucune condition
              avant la validation finale de cette dernière.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - En cas de réclamation du E-consommateur auprès de Hanuut
              Express, il doit communiquer l’ensemble des preuves justifiant son
              achat (motif de la réclamation, montant de la transaction, reçu de
              paiement en ligne, date de débit du montant de la transaction,
              relevé de compte CCP …). Le prix de vente du produit est celui en
              vigueur au moment de l'enregistrement de la commande à l'exclusion
              des frais de livraison qui peuvent être à la charge du
              E-consommateur et qui sera indiqué à l'enregistrement de la
              commande.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - Les prix mentionnés sur le catalogue sont indiqués en DZD TTC,
              valables au moment de leur consultation par le E-consommateur et
              sont ceux en vigueur au moment de l’enregistrement de la commande.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - Le reçu de paiement et les transactions sont libellés en DZD.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - Le montant minimum par transaction est de 200 DZD.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - Le E-consommateur est en droit de formuler une réclamation pour
              non-exécution de la commande auprès du E-fournisseur 01 Heures
              après la validation de sa commande (la transaction), dans un délai
              de 15 jours.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - En cas de d’indisponibilité du produit ou service commandé, le
              E-consommateur en sera informé au plutôt et aura la possibilité
              d’annuler sa commande. Il aura alors le choix de demander soit le
              remboursement intégral des sommes versées dans les 60 jours au
              plus tard de leur versement, soit l’échange du produit ou du
              service.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - Le remboursement se fera du compte CCP du E-consommateur.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - le E-consommateur dispose d’un droit de rectification relatif
              aux données le concernant.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - le E-consommateur peut être amené à recevoir des publicités de
              la part de l’E-fournisseur sauf s’il refuse que ses données
              nominatives soient utilisées à des fins commerciales et
              publicitaires.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - Les données des transactions enregistrées constituent la preuve
              de l’ensemble des transactions commerciales passées entre le
              E-consommateur et le E-fournisseur.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - Le relevé de compte constitue aussi une preuve des transactions
              effectuées par la carte Monétique d’Algérie Poste via le site.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -Tous les produits vendus sur le site sont garantis contre les
              défauts de fabrication et vice de matière. La durée de cette
              garantie est d'au moins 12 mois à partir de la date de facture.
              Cette garantie ne couvre pas les dommages résultant d'accidents,
              de mauvaise utilisation ou de négligence de la part de
              l’utilisateur.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - Toute utilisation frauduleuse par l’e-consommateur dudit service
              entraînera sa responsabilité de plein droit
            </TermsParagraph>
          </ListItem>

          <TermsSubHeading>4. Confidentialité</TermsSubHeading>
          <List>
            <ListItem>
              <TermsParagraph>
                - L’ensemble des données communiquées par l’E-consommateur sont
                nécessaires au traitement de la commande et sont traitées de
                manière confidentielle.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                - Cette confidentialité pourra être levée en cas de fraude ou
                sur demande des autorités judiciaires.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>5. Obligation d’E-fournisseur</TermsSubHeading>
          <List>
            <ListItem>
              <TermsParagraph>
                - L’ensemble des données communiquées par l’E-consommateur sont
                nécessaires au traitement de la commande et sont traitées de
                manière confidentielle.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                - Cette confidentialité pourra être levée en cas de fraude ou
                sur demande des autorités judiciaires.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>6. Obligation du client</TermsSubHeading>

          <TermsParagraph>
            L’E-consommateur s'engage à utiliser le service de paiement
            électronique via la carte EDAHABIA ou les cartes CIB de manière
            responsable, dans le respect des présentes CSU, des lois et de la
            réglementation applicable.
          </TermsParagraph>
          <TermsSubHeading>7. Résiliation</TermsSubHeading>

          <TermsParagraph>
            - En cas de non-respect des présentes conditions spécifique
            d’utilisation, Hanuut Express se réserve le droit, sans indemnités,
            ni préavis de suspendre ou fermer le compte de l'utilisateur et de
            lui refuser pour l'avenir tout ou partie du service, sans préjudice
            des différentes actions délictuelles ou contractuelles de droit
            commun qui pourraient lui être entreprises à son encontre.
          </TermsParagraph>

          <TermsSubHeading>8. Droit applicable</TermsSubHeading>

          <TermsParagraph>
            -Ces conditions spécifiques sont soumises au droit algérien. - Tous
            les différends de toute nature pouvant survenir entre
            l’e-consommateur et l’e-fournisseur, au sujet de l'interprétation,
            de la validité et/ou l’exécution des conditions spécifiques sera
            réglés à l'amiable par les Parties, à défaut de règlement amiable,
            les différends seront soumis à la juridiction algérienne
            territorialement compétente.
          </TermsParagraph>

          <TermsSubHeading>9. Modification</TermsSubHeading>

          <TermsParagraph>
            - Hanuut Express pourra à tout moment modifier ou mettre à jour les
            présentes conditions sans préavis.
          </TermsParagraph>

          <TermsSubHeading>10. Entrée en vigueur</TermsSubHeading>

          <TermsParagraph>
            -Les CSU entrent en vigueur à leur acceptation par E-consommateur ou
            de l’utilisation du service et sont valables jusqu’à l’acceptation
            du produit par ce dernier et après service livré
          </TermsParagraph>

          <TermsHeading>
            {" "}
            Conditions Générales de vente et paiement en ligne
          </TermsHeading>
          <TermsParagraph>
            Ces conditions générales de vente sont les conditions types minimum
            requises que la BNA demande au web marchand d’insérer sur son site
            et dont le web acheteur doit avoir pris connaissance, en reconnaît
            les conditions et les acceptent. La validation de la commande ne
            pourra se faire que si le web acheteur accepte les conditions
            prévues.
          </TermsParagraph>
          <TermsSubHeading>Préambule</TermsSubHeading>
          <TermsParagraph>
            Les présentes conditions générales de vente régissent l'ensemble des
            transactions en ligne établies sur le site www.hanuut.com Toute
            commande passée sur ce site suppose du web acheteur son acceptation
            inconditionnelle et irrévocable de ces conditions.
          </TermsParagraph>
          <TermsSubHeading>1. Objet</TermsSubHeading>
          <TermsParagraph>
            Le présent contrat objet des présentes conditions générales de vente
            est un contrat à distance qui a pour objet de définir les droits et
            obligations des parties dans le cadre de la vente sur Internet des
            produits et services de la société SARL Hanuut Express, par
            l’intermédiaire de son site en ligne www.hanuut.com ou son
            application mobile Hanuut Customer.
          </TermsParagraph>

          <TermsSubHeading>2. Définitions</TermsSubHeading>
          <TermsParagraph>
            Dans le présent contrat, chacune des expressions mentionnées
            s’entendra au sens de sa définition,
          </TermsParagraph>
          <List>
            <ListItem>
              <TermsParagraph>
                2.1 Bon de commande : document récapitulatif qui indique les
                caractéristiques des produits commandés par le web acheteur et
                qui doit être signé par lui « double clic » pour l’engager et
                procéder dans le règlement.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.2 Contrat à distance : tout contrat d’acquisition des produits
                ou services entre la société SARL Hanuut Express et un web
                acheteur dans le cadre d’un système de vente ou de prestations
                de service à distance organisé par la société SARL Hanuut
                Express qui, pour ce contrat, utilise exclusivement le réseau
                Internet jusqu’à la conclusion du contrat.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.3 Commande : acte par lequel le Web acheteur s’engage à
                acheter des Produits et/ou services et de la société SARL Hanuut
                Express s’engage à les délivrer par tous les moyens que ce
                soient.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.4 Force majeure : Tout évènement indépendant de la volonté des
                parties, insurmontable, imprévisible et irrésistible.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.5 Web acheteur: client du web marchand sur Internet ou
                l’utilisateur du service paiement en ligne. Le web acheteur
                désigne toute personne physique ou morale ayant souscrit un
                contrat porteur avec une banque émettrice de cartes, débouchant
                sur l'attribution d'une carte bancaire de paiement et de
                retrait. Dans le cadre du paiement en ligne le porteur est un
                acheteur qui utilise sa carte pour effectuer le paiement d’un
                bien ou d’un service sur internet
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.6 Web marchand : désigne SARL Hanuut Express qui est un
                commerçant de droit algérien tenant une boutique sur Internet.
                Le Web marchand bénéficie du service de paiement sécurisé par
                Internet.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>
            3. Les conditions Générales d’utilisation du service paiement en
            ligne sont :
          </TermsSubHeading>
          <TermsParagraph>
            En cochant la case d'acceptation des conditions lors du processus
            d'achat, le client confirme son acceptation sans réserve des
            présentes conditions de vente
          </TermsParagraph>

          <TermsParagraph>
            - L’accès au service est réservé aux détenteurs de carte CIB ayant
            le droit de son usage sur le site de paiement en ligne de Hanuut
            Express et jouissant de la capacité juridique. D'une manière
            générale, cela signifie que tout individu doit avoir au moins 19 ans
            pour devenir client et commander sur le site www.hanuut.com ou
            l'application mobile Hanuut Customer.
          </TermsParagraph>
          <TermsParagraph>
            - Tous les produits et services présents dans le catalogue sont
            commercialisés jusqu'à épuisement des stocks ou suppression du
            service offert. Hanuut se réserve le droit de retirer du catalogue
            un produit ou un service, et ceci sans préavis, elle ne peut en
            aucun cas, être tenue de dédommager, d'annuler une commande ou
            rembourser le montant y afférent suite à l'impossibilité d'utiliser
            le produit acheté pour une raison d'incompatibilité avec le matériel
            déjà possédé par le web acheteur ou suite à l’utilisation non
            conforme par ce dernier.
          </TermsParagraph>
          <TermsParagraph>
            - Le web acheteur doit fournir l’ensemble des informations requises
            avant la validation de sa commande, après sélection du service ou du
            produit, il sera ajouté dans le bon de commande. Lorsque les choix
            des produits ou services sont terminés la commande est validée,
            ensuite, il sera demandé au web acheteur de s’authentifier avec un
            mot de passe.
          </TermsParagraph>
          <TermsParagraph>
            - Le web acheteur est seul responsable des erreurs de saisie,
            notamment celles concernant le numéro bénéficiaire du paiement en
            ligne, et par conséquent, il assumera la totale responsabilité.
          </TermsParagraph>
          <TermsParagraph>
            - Le web acheteur peut annuler sa commande sans aucune condition
            avant la validation finale de cette dernière.
          </TermsParagraph>
          <TermsParagraph>
            - En cas de réclamation du web acheteur auprès de sa banque ou
            auprès de Hanuut Express, il doit communiquer l’ensemble des preuves
            justifiant son achat (motif de la réclamation, montant de la
            transaction, reçu de paiement en ligne, date de débit du montant de
            la transaction, relevé de compte bancaire….).
          </TermsParagraph>
          <TermsParagraph>
            - Le prix de vente du produit est celui en vigueur au moment de
            l'enregistrement de la commande avec les frais de livraison des
            frais de livraison qui sont à la charge du web acheteur et qui sera
            indiqué à l'enregistrement de la commande.
          </TermsParagraph>
          <TermsParagraph>
            - Le prix de vente d'un produit peut être modifié à tout moment,
            cette modification sera notifiée au web acheteur avant toute
            validation de commande.
          </TermsParagraph>
          <TermsParagraph>
            - Les prix mentionnés sur le catalogue sont indiqués en DZD TTC,
            valables au moment de leur consultation par le web acheteur et sont
            ceux en vigueur au moment de l’enregistrement de la commande.
          </TermsParagraph>
          <TermsParagraph>
            - Le bon de commande et les transactions sont libellés en DZD.
          </TermsParagraph>
          <TermsParagraph>
            - Le montant minimum par transaction est de 200 DZD.
          </TermsParagraph>
          <TermsParagraph>
            - Le web acheteur est en droit de formuler une réclamation pour
            non-exécution de la commande auprès du WEB Marchant ou de sa Banque
            01 Heures après la validation de sa commande.
          </TermsParagraph>
          <TermsParagraph>
            - Le Web acheteur dispose d’un délai de 15 jours à compter de la
            date de la transaction pour formaliser sa réclamation auprès de sa
            Banque.
          </TermsParagraph>
          <TermsParagraph>
            - En cas d’indisponibilité du produit ou service commandé, le web
            acheteur en sera informé au plus tôt et aura la possibilité
            d’annuler sa commande. Il aura alors le choix de demander soit le
            remboursement intégral de la somme du produit indisponible, soit
            l’échange du produit ou du service.
          </TermsParagraph>
          <TermsParagraph>
            - Le remboursement se fera exclusivement au niveau de la banque du
            web acheteur chez laquelle il devra se rapprocher à ce sujet.
          </TermsParagraph>
          <TermsParagraph>
            - L’ensemble des donnéescommuniquées par le web acheteur sont
            nécessaires au traitement de la commande et sont traitées de manière
            confidentielle.
          </TermsParagraph>
          <TermsParagraph>
            - Cette confidentialité pourra être levée en cas de fraude ou sur
            demande des autorités judiciaires.
          </TermsParagraph>
          <TermsParagraph>
            - Le web acheteur peut être amené à recevoir des publicités de la
            part de Hanuut Express sauf s’il refuse que ses données nominatives
            soient utilisées à des fins commerciales et publicitaires.
          </TermsParagraph>
          <TermsParagraph>
            - Les données des transactions enregistrées constituent la preuve de
            l’ensemble des transactions commerciales passées entre le web
            acheteur et Hanuut Express.
          </TermsParagraph>
          <TermsParagraph>
            - Le relevé de compte bancaire constitue aussi une preuve des
            transactions effectuées par carte bancaire via le site.
          </TermsParagraph>

          <TermsParagraph>
            - Le montant minimum par transaction est de 200 DZD.
          </TermsParagraph>
          <TermsSubHeading>4. Résiliation</TermsSubHeading>
          <TermsParagraph>
            - En cas de non respect des présentes conditions générales de vente,
            Hanuut Express se réserve le droit, sans indemnités, ni préavis de
            suspendre ou fermer le compte de l'utilisateur et de lui refuser
            pour l'avenir tout ou partie du service, sans préjudice des
            différentes actions délictuelles ou contractuelles de droit commun
            qui pourraient lui être entreprises à son encontre.
          </TermsParagraph>

          <TermsSubHeading>5. Entrée en vigueur</TermsSubHeading>
          <TermsParagraph>
            - En cas de non respect des présentes conditions générales de vente,
            Hanuut Express se réserve le droit, sans indemnités, ni préavis de
            suspendre ou fermer le compte de l'utilisateur et de lui refuser
            pour l'avenir tout ou partie du service, sans préjudice des
            différentes actions délictuelles ou contractuelles de droit commun
            qui pourraient lui être entreprises à son encontre.
          </TermsParagraph>

          <TermsSubHeading>6. Droit applicable</TermsSubHeading>

          <TermsParagraph>
            -Ces conditions générales sont soumises au droit algérien.
          </TermsParagraph>
          <TermsSubHeading>7. Règlement des différends</TermsSubHeading>

          <TermsParagraph>
            Tous les différends de toute nature pouvant survenir entre
            l’utilisateur et Hanuut Express au sujet de l'interprétation, de la
            validité et/ou l’exécution des conditions générales sera réglés à
            l'amiable par les Parties, à défaut de règlement amiable, les
            différends seront soumis à la juridiction algérienne
            territorialement compétente.
          </TermsParagraph>
          <TermsSubHeading>8. Modification</TermsSubHeading>

          <TermsParagraph>
            - Hanuut Express pourra à tout moment modifier ou mettre à jour les
            présentes conditions sans préavis.
          </TermsParagraph>
        </TermsAndConditions>
      ) : i18n.language === "en" ? (
        <TermsAndConditions>
          <TermsHeading>
            Specific Conditions of Use for Online Payment
          </TermsHeading>
          <TermsSubHeading>Preamble</TermsSubHeading>
          <TermsParagraph>
            These specific conditions of use for online payment via the EDAHABIA
            card or CIB cards, hereinafter referred to as "CSU: Specific
            Conditions of Use," apply to all online transactions established on
            the website www.hanuut.com or our mobile application Hanuut
            Customer. Any use of the online payment service via the EDAHABIA
            card on this site implies the prior and unconditional acceptance by
            the E-consumer of these CSU..
          </TermsParagraph>
          <TermsSubHeading>1. Purpose</TermsSubHeading>
          <TermsParagraph>
            These CSU aim to define the conditions and terms under which Hanuut
            Express offers the E-consumer holding an EDAHABIA card or CIB cards
            the use of the online payment service on its website www.hanuut.com
            or its mobile application Hanuut Customer.
          </TermsParagraph>

          <TermsSubHeading>2. Definitions</TermsSubHeading>
          <TermsParagraph>
            In accordance with these specific conditions of use, the following
            terms shall have the following meanings:
          </TermsParagraph>
          <List>
            <ListItem>
              <TermsParagraph>
                2.1 ORDER: is the means by which the E-consumer agrees to
                purchase services sold by the E-SUPPLIER online, which, in turn,
                undertakes to deliver them in accordance with the current
                legislative and regulatory provisions.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.2 E-SUPPLIER: SARL HANUUT EXPRESS, which offers the electronic
                provision of services defined in these CSU.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.3 E-consumer: Any natural or legal person who acquires a
                service electronically from the E-SUPPLIER for final use.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.4 Online store: the virtual shop for online services of the
                E-SUPPLIER.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.5 ALGERIA POST MONETARY CARD OR CIB CARDS: Monetary cards
                linked to a Postal or banking Current Account, compliant with
                the required standards, constituting an authorized means of
                payment for electronic transactions. électronique.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.6 SPECIFIC CONDITIONS OF USE "CSU": All rules displayed on the
                E-SUPPLIER's online store governing the use of the electronic
                payment service accepted by the E-consumer.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.7 ELECTRONIC PAYMENT: Service that allows the holder of the
                ALGERIA POST MONETARY CARD Eddahabia, as an E-consumer, to
                perform payment transactions for services on the E-SUPPLIER's
                online store.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>
            The specific conditions of use of the online payment service are as
            follows:
          </TermsSubHeading>
          <TermsParagraph>
            By checking the acceptance box during the purchase process, the
            customer confirms their unconditional acceptance of these terms and
            conditions of sale.
          </TermsParagraph>

          <ListItem>
            <TermsParagraph>
              -Access to the service is reserved for holders of the ALGERIA POST
              MONETARY CARD EDAHABIA or CIB cards, who have the right to use it
              on the Hanuut Express online payment site or its mobile
              application, and who have legal capacity. In general, this means
              that an individual must be at least 19 years old to become an
              E-consumer and place orders on the website www.hanuut.com or the
              Hanuut Customer mobile application.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The E-consumer must provide all the required information before
              validating their order. After selecting the service or product, it
              will be added to the payment receipt. Once the product or service
              choices are completed, the order is validated, and then the
              E-consumer will be asked to authenticate with a password.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The E-consumer is solely responsible for any input errors,
              especially those regarding the beneficiary's online payment
              number, and therefore assumes full responsibility.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The E-consumer can cancel their order without any conditions
              before its final validation.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -In the event of a complaint by the E-consumer to Hanuut Express,
              they must provide all the evidence justifying their purchase
              (reason for the complaint, transaction amount, online payment
              receipt, date of debiting the transaction amount, account
              statement, etc.). The sale price of the product is the one in
              effect at the time of the order's registration, excluding any
              delivery fees that may be borne by the E-consumer and will be
              indicated at the time of order registration.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The prices mentioned in the catalog are indicated in DZD
              (Algerian dinar) including taxes, valid at the time of
              consultation by the E-consumer and at the time of order
              registration.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The payment receipt and transactions are denominated in DZD.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The minimum amount per transaction is 200 DZD.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The E-consumer has the right to file a claim for non-execution of
              the order with the E-supplier within 01 hour after validating
              their order (transaction), within a period of 15 days.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -In the event of unavailability of the ordered product or service,
              the E-consumer will be informed as soon as possible and will have
              the option to cancel their order. They will then have the choice
              to either receive a full refund of the amounts paid within a
              maximum of 60 days from the date of payment or exchange the
              product or service.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The refund will be made to the E-consumer's account.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The E-consumer has the right to rectify their personal data.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The E-consumer may receive advertisements from the E-supplier
              unless they refuse the use of their personaldata for marketing
              purposes.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The recorded transaction data constitutes proof of all past
              commercial transactions between the E-consumer and the E-supplier.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -The account statement also serves as proof of transactions made
              with the Algerian Post Monetary Card via the website.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -All products sold on the website are guaranteed against
              manufacturing defects and material flaws. The duration of this
              warranty is at least 12 months from the invoice date. This
              warranty does not cover damages resulting from accidents, misuse,
              or negligence on the part of the user.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -Any fraudulent use of the service by the E-consumer will result
              in their automatic liability.
            </TermsParagraph>
          </ListItem>

          <TermsSubHeading>4. Confidentiality</TermsSubHeading>
          <List>
            <ListItem>
              <TermsParagraph>
                - All data provided by the E-consumer is necessary for order
                processing and is treated confidentially.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                - This confidentiality may be lifted in case of fraud or upon
                request by judicial authorities.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>5. Obligation of the E-supplier</TermsSubHeading>
          <List>
            <ListItem>
              <TermsParagraph>
                - All data provided by the E-consumer is necessary for order
                processing and is treated confidentially.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                - This confidentiality may be lifted in case of fraud or upon
                request by judicial authorities.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>6. Obligation of the customer</TermsSubHeading>

          <TermsParagraph>
            The E-consumer agrees to use the electronic payment service via the
            EDAHABIA card or CIB cards responsibly, in compliance with these
            terms and conditions, applicable laws, and regulations.
          </TermsParagraph>
          <TermsSubHeading>7. Termination</TermsSubHeading>

          <TermsParagraph>
            - In case of non-compliance with these specific terms of use, Hanuut
            Express reserves the right, without compensation or prior notice, to
            suspend or close the user's account and refuse them all or part of
            the service in the future, without prejudice to any legal or
            contractual actions that may be taken against them.
          </TermsParagraph>

          <TermsSubHeading>8. Applicable law</TermsSubHeading>

          <TermsParagraph>
            - These specific terms are subject to Algerian law. Any disputes of
            any nature that may arise between the E-consumer and the E-supplier
            regarding the interpretation, validity, and/or enforcement of these
            specific terms will be settled amicably by the Parties. In the
            absence of an amicable settlement, the disputes will be submitted to
            the competent Algerian jurisdiction.
          </TermsParagraph>

          <TermsSubHeading>9. Modification</TermsSubHeading>

          <TermsParagraph>
            - Hanuut Express may modify or update these terms at any time
            without prior notice.
          </TermsParagraph>

          <TermsSubHeading>10. Effective date</TermsSubHeading>

          <TermsParagraph>
            - The terms and conditions come into effect upon acceptance by the
            E-consumer or use of the service and remain valid until the
            acceptance of the product by the E-consumer and after the service is
            delivered.
          </TermsParagraph>

          <TermsHeading>
            {" "}
            General terms and conditions of sale and online payment.
          </TermsHeading>
          <TermsParagraph>
            These general terms and conditions of sale are the minimum required
            conditions that BNA (National Bank of Algeria) requests the web
            merchant to include on their website, and which the web buyer must
            acknowledge, accept, and agree to. The order validation can only be
            done if the web buyer accepts the provided conditions.
          </TermsParagraph>
          <TermsSubHeading>Preamble</TermsSubHeading>
          <TermsParagraph>
            These general terms and conditions of sale govern all online
            transactions established on the website www.hanuut.com. Placing an
            order on this site implies the unconditional and irrevocable
            acceptance of these conditions by the web buyer.
          </TermsParagraph>
          <TermsSubHeading>1. Object</TermsSubHeading>
          <TermsParagraph>
            This contract, subject to these general terms and conditions of
            sale, is a distance contract that aims to define the rights and
            obligations of the parties in the context of the online sale of
            products and services by the company SARL Hanuut Express through its
            online website www.hanuut.com or its mobile application Hanuut
            Customer.
          </TermsParagraph>

          <TermsSubHeading>2. Definitions</TermsSubHeading>
          <TermsParagraph>
            In this contract, each of the mentioned expressions shall have the
            meaning as defined below:
          </TermsParagraph>
          <List>
            <ListItem>
              <TermsParagraph>
                2.1 Order form: a summary document that indicates the
                characteristics of the products ordered by the web buyer and
                must be signed by them ("double click") to commit and proceed
                with the payment.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.2 Distance contract: any contract for the acquisition of
                products or services between the company SARL Hanuut Express and
                a web buyer within the framework of a system of distance selling
                or provision of services organized by the company SARL Hanuut
                Express, which exclusively uses the Internet until the
                conclusion of the contract.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.3 Order: the act by which the web buyer commits to purchasing
                products and/or services, and the company SARL Hanuut Express
                commits to delivering them by any means necessary.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.4 Force majeure: any event beyond the control of the parties,
                insurmountable, unforeseeable, and irresistible.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.5 Web buyer: a customer of the web merchant on the Internet or
                a user of the online payment service. The web buyer refers to
                any individual or legal entity who has entered into an agreement
                with a card-issuing bank, resulting in the issuance of a payment
                and withdrawal bank card. In the context of online payment, the
                cardholder is a buyer who uses their card to make a payment for
                goods or services online.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.6 Web merchant: refers to SARL Hanuut Express, which is an
                Algerian merchant operating a shop on the Internet. The web
                merchant benefits from the secure online payment service.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>
            3. The General Conditions of Use for the online payment service are
            as follows:
          </TermsSubHeading>
          <TermsParagraph>
            By checking the acceptance box during the purchase process, the
            customer confirms their unconditional acceptance of these terms and
            conditions of sale.
          </TermsParagraph>

          <TermsParagraph>
            Access to the service is reserved for CIB cardholders who have the
            right to use it on Hanuut Express's online payment site and who have
            legal capacity. In general, this means that an individual must be at
            least 19 years old to become a customer and place orders on the
            website www.hanuut.com or the Hanuut Customer mobile application.
          </TermsParagraph>
          <TermsParagraph>
            All products and services in the catalog are marketed until stocks
            are depleted or the offered service is discontinued. Hanuut reserves
            the right to remove a product or service from the catalog without
            prior notice. In such cases, Hanuut cannot be held liable for
            compensation, cancellation of an order, or refund of the
            corresponding amount due to the inability to use the purchased
            product due to incompatibility with the web buyer's existing
            hardware or improper use by the web buyer.
          </TermsParagraph>
          <TermsParagraph>
            The web buyer must provide all the required information before
            validating their order. After selecting the product or service, it
            will be added to the order form. Once the product or service choices
            are completed, the order is validated, and the web buyer will be
            asked to authenticate with a password.
          </TermsParagraph>
          <TermsParagraph>
            The web buyer is solely responsible for input errors, especially
            those regarding the beneficiary number for online payment.
            Consequently, they will assume full responsibility.
          </TermsParagraph>
          <TermsParagraph>
            The web buyer can cancel their order without any conditions before
            the final validation.
          </TermsParagraph>
          <TermsParagraph>
            In case of a complaint from the web buyer to their bank or to Hanuut
            Express, they must provide all the evidence justifying their
            purchase (reason for the complaint, transaction amount, online
            payment receipt, transaction debit date, bank account statement,
            etc.).
          </TermsParagraph>
          <TermsParagraph>
            The selling price of the product is the one in effect at the time of
            order registration, including the delivery fees that are the
            responsibility of the web buyer and will be indicated upon order
            registration.
          </TermsParagraph>
          <TermsParagraph>
            The selling price of a product may be modified at any time, and this
            modification will be notified to the web buyer before any order
            validation.
          </TermsParagraph>
          <TermsParagraph>
            The prices mentioned in the catalog are indicated in DZD (Algerian
            Dinar) including taxes, valid at the time of consultation by the web
            buyer, and are those in effect at the time of order registration.
          </TermsParagraph>
          <TermsParagraph>
            The order form and transactions are denominated in DZD.
          </TermsParagraph>
          <TermsParagraph>
            he minimum amount per transaction is 200 DZD.
          </TermsParagraph>
          <TermsParagraph>
            The web buyer has the right to file a claim for non-execution of the
            order with the web merchant or their bank within 01 hour after order
            validation.
          </TermsParagraph>
          <TermsParagraph>
            The web buyer has a period of 15 days from the transaction date to
            formalize their claim with their bank.
          </TermsParagraph>
          <TermsParagraph>
            In case of unavailability of the ordered product or service, the web
            buyer will be notified as soon as possible and will have the option
            to cancel their order. They will then have the choice to request
            either a full refund of the amount for the unavailable product or
            service or the exchange of the product or service.
          </TermsParagraph>
          <TermsParagraph>
            The refund will be made exclusively through the web buyer's bank,
            with whom they must contact for this purpose.
          </TermsParagraph>
          <TermsParagraph>
            All data provided by the web buyer is necessary for order processing
            and will be treated confidentially.
          </TermsParagraph>
          <TermsParagraph>
            This confidentiality may be lifted in case of fraud or at the
            request of judicial authorities.
          </TermsParagraph>
          <TermsParagraph>
            The web buyer may receive advertisements from Hanuut Express unless
            they refuse to have their personal data used for commercial and
            advertising purposes.
          </TermsParagraph>
          <TermsParagraph>
            The recorded transaction data constitutes evidence of all commercial
            transactions between the web buyer and Hanuut Express.
          </TermsParagraph>
          <TermsParagraph>
            The bank account statement also constitutes evidence of transactions
            made by credit card via the website.
          </TermsParagraph>

          <TermsParagraph>
            The minimum amount per transaction is 200 DZD.
          </TermsParagraph>
          <TermsSubHeading>4. Termination</TermsSubHeading>
          <TermsParagraph>
            In the event of non-compliance with these general terms and
            conditions of sale, Hanuut Express reserves the right, without
            compensation or notice, to suspend or close the user's account and
            to refuse them all or part of the service in the future, without
            prejudice to any legal actions that may be taken against them.
          </TermsParagraph>

          <TermsSubHeading>5. Effective Date</TermsSubHeading>
          <TermsParagraph>
            In case of non-compliance with these general terms and conditions of
            sale, Hanuut Express reserves the right, without compensation or
            notice, to suspend or close the user's account and to refuse them
            all or part of the service in the future, without prejudice to any
            legal actions that may be taken against them.
          </TermsParagraph>

          <TermsSubHeading>6. Applicable Law:</TermsSubHeading>

          <TermsParagraph>
            These general terms and conditions are subject to Algerian law.
          </TermsParagraph>
          <TermsSubHeading>7. Dispute Resolution</TermsSubHeading>

          <TermsParagraph>
            All disputes of any kind that may arise between the user and Hanuut
            Express regarding the interpretation, validity, and/or execution of
            the general terms and conditions will be resolved amicably by the
            parties. In the absence of an amicable settlement, the disputes will
            be submitted to the competent Algerian jurisdiction.
          </TermsParagraph>
          <TermsSubHeading>8. Modification</TermsSubHeading>

          <TermsParagraph>
            Hanuut Express may modify or update these terms and conditions at
            any time without prior notice.
          </TermsParagraph>
        </TermsAndConditions>
      ) : (
        <TermsAndConditions isArabic={i18n.language === "ar"}>
          <TermsHeading>
            الشروط المحددة للاستخدام للدفع عبر الإنترنت
          </TermsHeading>
          <TermsSubHeading>الديباجة</TermsSubHeading>
          <TermsParagraph>
            هذه الشروط المحددة للاستخدام للدفع عبر الإنترنت من خلال EDAHABIA
            البطاقة أو بطاقات CIB، والمشار إليها فيما بعد باسم "CSU: محددة شروط
            الاستخدام،" تنطبق على جميع المعاملات عبر الإنترنت التي تم إنشاؤها في
            الموقع الإلكتروني www.hanuut.com أو تطبيق الهاتف المحمول الخاص بنا
            Hanuut عميل. أي استخدام لخدمة الدفع عبر الإنترنت عبر EDAHABIA
            البطاقة الموجودة على هذا الموقع تعني القبول المسبق وغير المشروط من
            قبل المستهلك الإلكتروني لهذه CSU.
          </TermsParagraph>
          <TermsSubHeading>1. الغرض</TermsSubHeading>
          <TermsParagraph>
            تهدف CSU هذه إلى تحديد الشروط والأحكام التي يتم بموجبها Hanuut تقدم
            شركة Express للمستهلك الإلكتروني حامل بطاقة EDAHABIA أو بطاقات CIB
            استخدام خدمة الدفع عبر الإنترنت على موقعها الإلكتروني www.hanuut.com
            أو تطبيق الهاتف المحمول الخاص به Hanuut Customer.
          </TermsParagraph>

          <TermsSubHeading>2. تعريفات</TermsSubHeading>
          <TermsParagraph>
            وفقا لهذه الشروط المحددة للاستخدام، ما يلي يكون للمصطلحات المعاني
            التالية:
          </TermsParagraph>
          <List>
            <ListItem>
              <TermsParagraph>
                2.1 الطلب: هو الوسيلة التي يوافق عليها المستهلك الإلكتروني شراء
                الخدمات التي يبيعها المورد الإلكتروني عبر الإنترنت، والتي
                بدورها، يتعهد بتسليمها وفقا للتيار الأحكام التشريعية والتنظيمية.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.2 المورد الإلكتروني: SARL HANUUT EXPRESS، الذي يقدم المنتجات
                الإلكترونية توفير الخدمات المحددة في CSU هذه.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.3 المستهلك الإلكتروني: أي شخص طبيعي أو اعتباري يحصل على الخدمة
                إلكترونيًا من المورد الإلكتروني للاستخدام النهائي.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.4 المتجر الإلكتروني: المتجر الافتراضي للخدمات عبر الإنترنت
                الخاص بـ المورد الإلكتروني.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2..5 بطاقة بريد الجزائر النقدية أو بطاقات CIB: البطاقات النقدية
                مرتبط بحساب جاري بريدي أو مصرفي متوافق مع المعايير المطلوبة،
                والتي تشكل وسيلة معتمدة ل الدفع للمعاملات الإلكترونية.
                الكترونية.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.6 شروط الاستخدام الخاصة "CSU": جميع القواعد المعروضة على متجر
                E-SUPPLIER الإلكتروني الذي ينظم استخدام المنتجات الإلكترونية
                خدمة الدفع المقبولة من قبل المستهلك الإلكتروني.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.7 الدفع الإلكتروني: الخدمة التي تتيح لحاملها بطاقة بريد
                الجزائر النقدية الدهبية، كمستهلك إلكتروني، ل إجراء معاملات الدفع
                مقابل الخدمات على الموردين الإلكترونيين متجر على الانترنت.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>
            الشروط المحددة لاستخدام خدمة الدفع عبر الإنترنت هي كما يلي :
          </TermsSubHeading>
          <TermsParagraph>
            من خلال تحديد مربع القبول أثناء عملية الشراء، سيتم يؤكد العميل قبوله
            غير المشروط لهذه الشروط و شروط البيع.
          </TermsParagraph>

          <ListItem>
            <TermsParagraph>
              - الولوج إلى الخدمة محجوز لحاملي بريد الجزائر البطاقة النقدية
              EDAHABIA أو بطاقات CIB، الذين لهم الحق في استخدامها على موقع الدفع
              عبر الإنترنت Hanuut Express أو على هاتفه المحمول الطلب ومن لهم
              الأهلية القانونية. على العموم هذا يعني أن يبلغ عمر الفرد 19 عامًا
              على الأقل ليصبح عضوًا المستهلك الإلكتروني وتقديم الطلبات على
              الموقع الإلكتروني www.hanuut.com أو تطبيقات الهاتف المتحرك للعملاء
              Hanuut.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -يجب على المستهلك الإلكتروني تقديم كافة المعلومات المطلوبة قبل ذلك
              التحقق من صحة أمرهم. بعد اختيار الخدمة أو المنتج سيتم إضافتها إلى
              إيصال الدفع. بمجرد المنتج أو الخدمة يتم الانتهاء من الاختيارات،
              ويتم التحقق من صحة الطلب، ومن ثم سيُطلب من المستهلك الإلكتروني
              المصادقة بكلمة مرور.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -المستهلك الإلكتروني هو المسؤول الوحيد عن أي أخطاء في الإدخال،
              وخاصة تلك المتعلقة بالدفع عبر الإنترنت للمستفيد الرقم، وبالتالي
              يتحمل المسؤولية الكاملة.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -يمكن للمستهلك الإلكتروني إلغاء طلبه دون أي شروط قبل المصادقة
              النهائية عليها.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -في حالة وجود شكوى من قبل المستهلك الإلكتروني لشركة Hanuut
              Express، ويجب عليهم تقديم جميع الأدلة التي تبرر شرائهم (سبب
              الشكوى، مبلغ المعاملة، الدفع عبر الإنترنت الاستلام، تاريخ خصم مبلغ
              المعاملة، الحساب بيان الخ). سعر بيع المنتج هو نفسه ساري المفعول في
              وقت تسجيل الأمر، باستثناء أي رسوم التوصيل التي قد يتحملها المستهلك
              الإلكتروني وستكون كذلك المشار إليها في وقت تسجيل الطلب.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - الأسعار المذكورة في الكتالوج مبينة بالدينار الجزائري (الدينار
              الجزائري) شامل الضرائب، صالح في وقت التشاور من قبل المستهلك
              الإلكتروني وفي وقت الطلب تسجيل.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -إيصال الدفع والمعاملات مقوم بالدينار الجزائري.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - يحق للمستهلك الإلكتروني رفع دعوى عدم التنفيذ الطلب مع المورد
              الإلكتروني خلال 01 ساعة بعد التحقق من صحته طلبهم (المعاملة)، خلال
              فترة 15 يوما.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - في حالة عدم توفر المنتج أو الخدمة المطلوبة، سيتم إبلاغ المستهلك
              الإلكتروني في أقرب وقت ممكن، وسوف يكون خيار إلغاء طلبهم. وسيكون
              لهم بعد ذلك الاختيار إما لاسترداد كامل المبالغ المدفوعة خلال أ بحد
              أقصى 60 يومًا من تاريخ الدفع أو استبدال المبلغ المنتج أو الخدمة.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - سيتم رد المبلغ إلى حساب المستهلك الإلكتروني.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - يحق للمستهلك الإلكتروني تصحيح بياناته الشخصية.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - قد يتلقى المستهلك الإلكتروني إعلانات من المورد الإلكتروني إلا
              إذا رفضوا استخدام بياناتهم الشخصية للتسويق المقاصد.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - تعتبر بيانات المعاملات المسجلة دليلاً على كل ما مضى المعاملات
              التجارية بين المستهلك الإلكتروني والمورد الإلكتروني.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              -يعمل كشف الحساب أيضًا كدليل على المعاملات التي تمت ببطاقة البريد
              النقدي الجزائرية عبر الموقع.
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - جميع المنتجات المباعة على الموقع مضمونة عيوب التصنيع وعيوب
              المواد. مدة هذا الضمان لا يقل عن 12 شهرا من تاريخ الفاتورة. هذا
              الضمان لا يغطي الأضرار الناتجة عن الحوادث، سوء الاستخدام، أو إهمال
              من جانب المستخدم
            </TermsParagraph>
          </ListItem>
          <ListItem>
            <TermsParagraph>
              - سيترتب على ذلك أي استخدام احتيالي للخدمة من قبل المستهلك
              الإلكتروني في مسؤوليتهم التلقائية.
            </TermsParagraph>
          </ListItem>

          <TermsSubHeading>4. السرية</TermsSubHeading>
          <List>
            <ListItem>
              <TermsParagraph>
                - جميع البيانات التي يقدمها المستهلك الإلكتروني ضرورية للطلب
                المعالجة ويتم التعامل معها بسرية
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                - يجوز رفع هذه السرية في حالة الاحتيال أو عنده طلب من السلطات
                القضائية.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>5. التزام المورد الإلكتروني</TermsSubHeading>
          <List>
            <ListItem>
              <TermsParagraph>
                - جميع البيانات التي يقدمها المستهلك الإلكتروني ضرورية للطلب
                المعالجة ويتم التعامل معها بسرية.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                - يجوز رفع هذه السرية في حالة الاحتيال أو عنده طلب من السلطات
                القضائية.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>6. لتزام العميل</TermsSubHeading>

          <TermsParagraph>
            يوافق المستهلك الإلكتروني على استخدام خدمة الدفع الإلكتروني عبر
            بطاقة EDAHABIA أو بطاقات CIB بمسؤولية، مع الامتثال لهذه الشروط
            والأحكام والقوانين واللوائح المعمول بها.
          </TermsParagraph>
          <TermsSubHeading>7. Termination</TermsSubHeading>

          <TermsParagraph>
            - في حالة عدم الالتزام بشروط الاستخدام المحددة هذه، Hanuut تحتفظ
            Express بالحق، دون تعويض أو إشعار مسبق، في تعليق أو إغلاق حساب
            المستخدم ورفضها كلها أو جزء منها الخدمة في المستقبل، دون الإخلال
            بأية أحكام قانونية أو الإجراءات التعاقدية التي قد يتم اتخاذها ضدهم.
          </TermsParagraph>

          <TermsSubHeading>8. القانون المعمول به</TermsSubHeading>

          <TermsParagraph>
            - تخضع هذه الشروط المحددة للقانون الجزائري. أي نزاعات أي طبيعة قد
            تنشأ بين المستهلك الإلكتروني والمورد الإلكتروني فيما يتعلق بتفسير
            و/أو صحة و/أو إنفاذها سيتم تسوية الشروط المحددة وديًا من قبل
            الطرفين. في ال وفي حالة عدم التوصل إلى تسوية ودية، سيتم تقديم
            النزاعات إلى القضاء الجزائري المختص.
          </TermsParagraph>

          <TermsSubHeading>9. التعديل</TermsSubHeading>

          <TermsParagraph>
            - يجوز لشركة Hanuut Express تعديل هذه الشروط أو تحديثها في أي وقت
            بدون إعلام مسبق.
          </TermsParagraph>

          <TermsSubHeading>10. تاريخ النفاذ</TermsSubHeading>

          <TermsParagraph>
            - تدخل الشروط والأحكام حيز التنفيذ عند قبولها من قبل المستهلك
            الإلكتروني أو استخدام الخدمة وتظل سارية حتى قبول المنتج من قبل
            المستهلك الإلكتروني وبعد الخدمة تم التوصيل.
          </TermsParagraph>

          <TermsHeading>
            {" "}
            الشروط والأحكام العامة للبيع والدفع عبر الإنترنت.
          </TermsHeading>
          <TermsParagraph>
            هذه الشروط والأحكام العامة للبيع هي الحد الأدنى المطلوب الشروط التي
            يطلبها البنك الوطني الجزائري (BNA) عبر الويب التاجر لتضمينه على
            موقعه على الويب، والذي يجب على المشتري عبر الويب تقر، تقبل، وتوافق
            على. التحقق من صحة الطلب يمكن أن يكون فقط يتم ذلك إذا قبل المشتري
            عبر الويب الشروط المقدمة.
          </TermsParagraph>
          <TermsSubHeading> الديباجة</TermsSubHeading>
          <TermsParagraph>
            تحكم شروط وأحكام البيع العامة هذه جميعها عبر الإنترنت المعاملات التي
            تم إنشاؤها على موقع www.hanuut.com. وضع النظام على هذا الموقع يعني
            غير مشروط وغير قابل للإلغاء قبول هذه الشروط من قبل المشتري على شبكة
            الإنترنت.
          </TermsParagraph>
          <TermsSubHeading>1. Object</TermsSubHeading>
          <TermsParagraph>
            يخضع هذا العقد لهذه الشروط والأحكام العامة البيع، هو عقد عن بعد يهدف
            إلى تحديد الحقوق و التزامات الأطراف في سياق البيع عبر الإنترنت
            المنتجات والخدمات التي تقدمها شركة SARL Hanuut Express من خلال
            الموقع الإلكتروني www.hanuut.com أو تطبيق الهاتف المحمول الخاص به
            Hanuut عميل.
          </TermsParagraph>

          <TermsSubHeading>2. التعاريف</TermsSubHeading>
          <TermsParagraph>
            في هذا العقد، يكون لكل من العبارات المذكورة المعنى كما هو محدد
            أدناه:
          </TermsParagraph>
          <List>
            <ListItem>
              <TermsParagraph>
                2.1 نموذج الطلب: وثيقة ملخصة تشير إلى خصائص المنتجات التي يطلبها
                المشتري عبر الإنترنت و يجب أن يتم التوقيع بواسطتهم ("النقر
                المزدوج") للالتزام والمتابعة مع الدفع.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.2 العقد عن بعد: أي عقد للاستحواذ المنتجات أو الخدمات بين شركة
                SARL Hanuut Express و مشتري عبر الإنترنت في إطار نظام البيع عن
                بعد أو تقديم الخدمات التي تنظمها شركة SARL Hanuut Express، الذي
                يستخدم الإنترنت حصريًا حتى إبرام العقد.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.3 الطلب: الفعل الذي يلتزم به المشتري عبر الإنترنت بالشراء
                المنتجات و/أو الخدمات، وشركة SARL Hanuut Express ويلتزم بتسليمها
                بأي وسيلة ضرورية.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.4 القوة القاهرة: أي حدث خارج عن سيطرة الأطراف، لا يمكن التغلب
                عليها، ولا يمكن التنبؤ بها، ولا يقاوم.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.5 مشتري الويب: عميل تاجر الويب على الإنترنت أو مستخدم خدمة
                الدفع عبر الإنترنت. يشير المشتري على شبكة الإنترنت إلى أي فرد أو
                كيان قانوني أبرم اتفاقية مع البنك المُصدر للبطاقة، مما يؤدي إلى
                إصدار دفعة وسحب البطاقة المصرفية. في سياق الدفع عبر الإنترنت،
                حامل البطاقة هو المشتري الذي يستخدم بطاقته لإجراء الدفع السلع أو
                الخدمات عبر الإنترنت.
              </TermsParagraph>
            </ListItem>
            <ListItem>
              <TermsParagraph>
                2.6 تاجر الويب: يشير إلى SARL Hanuut Express، وهو عبارة عن تاجر
                جزائري يدير متجرا على الانترنت. الويب يستفيد التاجر من خدمة
                الدفع الآمنة عبر الإنترنت.
              </TermsParagraph>
            </ListItem>
          </List>

          <TermsSubHeading>
            3. الشروط العامة لاستخدام خدمة الدفع عبر الإنترنت هي على النحو
            التالي:
          </TermsSubHeading>
          <TermsParagraph>
            من خلال تحديد مربع القبول أثناء عملية الشراء، سيتم يؤكد العميل قبوله
            غير المشروط لهذه الشروط و شروط البيع.
          </TermsParagraph>

          <TermsParagraph>
            الوصول إلى الخدمة محجوز لحاملي بطاقات CIB الذين لديهم الحق في
            استخدامه على موقع الدفع عبر الإنترنت الخاص بـ Hanuut Express ومن
            لديه الأهلية القانونية. بشكل عام، هذا يعني أن الفرد يجب أن يكون في
            لا يقل عمره عن 19 عامًا ليصبح عميلاً ويقدم الطلبات على موقع الويب
            www.hanuut.com أو تطبيق الهاتف المحمول Hanuut Customer.
          </TermsParagraph>
          <TermsParagraph>
            يتم تسويق جميع المنتجات والخدمات الموجودة في الكتالوج حتى المخزون
            استنفدت أو توقفت الخدمة المقدمة. احتياطي الحانوت الحق في إزالة منتج
            أو خدمة من الكتالوج بدون إشعار مسبق. في مثل هذه الحالات، لا يمكن
            تحميل Hanuut المسؤولية التعويض أو إلغاء الطلب أو استرداد المبلغ
            المبلغ المقابل بسبب عدم القدرة على استخدام ما تم شراؤه المنتج بسبب
            عدم التوافق مع المنتج الحالي للمشتري عبر الإنترنت الأجهزة أو
            الاستخدام غير السليم من قبل مشتري الويب.
          </TermsParagraph>
          <TermsParagraph>
            يجب على مشتري الويب تقديم جميع المعلومات المطلوبة من قبل التحقق من
            صحة أمرهم. بعد اختيار المنتج أو الخدمة سيتم إضافتها إلى نموذج الطلب.
            بمجرد اختيار المنتج أو الخدمة يتم الانتهاء، ويتم التحقق من صحة
            الطلب، وسيكون المشتري عبر الإنترنت طلب المصادقة بكلمة مرور.
          </TermsParagraph>
          <TermsParagraph>
            يتحمل المشتري عبر الويب وحده المسؤولية عن أخطاء الإدخال، على وجه
            الخصوص تلك المتعلقة برقم المستفيد للدفع عبر الإنترنت. وبالتالي
            سيتحملون المسؤولية الكاملة.
          </TermsParagraph>
          <TermsParagraph>
            يمكن للمشتري عبر الإنترنت إلغاء طلبه دون أي شروط من قبل التحقق
            النهائي.
          </TermsParagraph>
          <TermsParagraph>
            في حالة وجود شكوى من المشتري عبر الويب إلى بنكه أو إلى Hanuut صريحة،
            يجب عليهم تقديم جميع الأدلة التي تبرر موقفهم الشراء (سبب الشكوى،
            مبلغ المعاملة، عبر الإنترنت إيصال الدفع، تاريخ الخصم للمعاملة، كشف
            الحساب البنكي، إلخ.).
          </TermsParagraph>
          <TermsParagraph>
            سعر بيع المنتج هو السعر الساري في وقت تسجيل الطلب، بما في ذلك رسوم
            التسليم التي هي مسؤولية المشتري عبر الإنترنت وسيتم الإشارة إليها عند
            الطلب تسجيل.
          </TermsParagraph>
          <TermsParagraph>
            يجوز تعديل سعر بيع المنتج في أي وقت، وهذا سيتم إخطار المشتري عبر
            الإنترنت بالتعديل قبل أي طلب تصديق.
          </TermsParagraph>
          <TermsParagraph>
            الأسعار المذكورة في الكتالوج موضحة بالدج (الجزائري دينار) بما في ذلك
            الضرائب، صالحة في وقت التشاور عبر شبكة الإنترنت المشتري، وهي سارية
            في وقت تسجيل الطلب.
          </TermsParagraph>
          <TermsParagraph>
            نموذج الطلب والمعاملات مقومة بالدينار الأردني.
          </TermsParagraph>
          <TermsParagraph>
            الحد الأدنى للمبلغ لكل معاملة هو 200 دج.
          </TermsParagraph>
          <TermsParagraph>
            يحق للمشتري عبر الإنترنت تقديم مطالبة بعدم تنفيذ الأمر اطلب مع تاجر
            الويب أو البنك الخاص بهم في غضون ساعة واحدة بعد الطلب تصديق.
          </TermsParagraph>
          <TermsParagraph>
            لدى المشتري عبر الإنترنت فترة 15 يومًا من تاريخ المعاملة إلى إضفاء
            الطابع الرسمي على مطالبتهم مع البنك الذي يتعاملون معه.
          </TermsParagraph>
          <TermsParagraph>
            في حالة عدم توفر المنتج أو الخدمة المطلوبة، فإن الويب سيتم إخطار
            المشتري في أقرب وقت ممكن وسيكون لديه الخيار لإلغاء طلبهم. سيكون
            لديهم بعد ذلك خيار الطلب إما استرداد كامل المبلغ للمنتج غير متوفر أو
            الخدمة أو تبادل المنتج أو الخدمة.
          </TermsParagraph>
          <TermsParagraph>
            سيتم استرداد المبلغ حصريًا من خلال بنك المشتري عبر الإنترنت، ومن يجب
            عليهم الاتصال به لهذا الغرض.
          </TermsParagraph>
          <TermsParagraph>
            جميع البيانات المقدمة من المشتري عبر الإنترنت ضرورية لمعالجة الطلب
            وسيتم التعامل معها بسرية.
          </TermsParagraph>
          <TermsParagraph>
            ويجوز رفع هذه السرية في حالة الاحتيال أو في طلب من السلطات القضائية.
          </TermsParagraph>
          <TermsParagraph>
            قد يتلقى مشتري الويب إعلانات من Hanuut Express ما لم يرفضون استخدام
            بياناتهم الشخصية لأغراض تجارية و أغراض إعلانية.
          </TermsParagraph>
          <TermsParagraph>
            تشكل بيانات المعاملات المسجلة دليلاً على جميع المعاملات التجارية
            المعاملات بين مشتري الويب وHanuut Express.
          </TermsParagraph>
          <TermsParagraph>
            ويشكل كشف الحساب البنكي أيضًا دليلاً على المعاملات يتم إجراؤها
            بواسطة بطاقة الائتمان عبر الموقع الإلكتروني.
          </TermsParagraph>

          <TermsParagraph>
            الحد الأدنى للمبلغ لكل معاملة هو 200 دج.
          </TermsParagraph>
          <TermsSubHeading>4. الإنهاء</TermsSubHeading>
          <TermsParagraph>
            في حالة عدم الالتزام بهذه الشروط العامة و شروط البيع، تحتفظ شركة
            Hanuut Express بالحق، بدون تعويض أو إشعار، لتعليق أو إغلاق حساب
            المستخدم و لرفضهم كل أو جزء من الخدمة في المستقبل، دون مع عدم
            الإخلال بأية إجراءات قانونية قد تتخذ ضدهم.
          </TermsParagraph>

          <TermsSubHeading>5. تاريخ النفاذ</TermsSubHeading>
          <TermsParagraph>
            في حالة عدم الالتزام بهذه الشروط والأحكام العامة البيع، تحتفظ شركة
            Hanuut Express بالحق، دون تعويض أو إشعار بتعليق أو إغلاق حساب
            المستخدم ورفضه كل أو جزء من الخدمة في المستقبل، دون المساس بأي منها
            الإجراءات القانونية التي قد يتم اتخاذها ضدهم.
          </TermsParagraph>

          <TermsSubHeading>6. القانون المعمول به :</TermsSubHeading>

          <TermsParagraph>
            تخضع هذه الشروط والأحكام العامة للقانون الجزائري.
          </TermsParagraph>
          <TermsSubHeading>7. حل النزاعات</TermsSubHeading>

          <TermsParagraph>
            جميع النزاعات مهما كان نوعها التي قد تنشأ بين المستخدم وHanuut
            التعبير عن التفسير و/أو الصلاحية و/أو التنفيذ سيتم حل الشروط
            والأحكام العامة وديًا من قبل حفلات. وفي حالة عدم التوصل إلى تسوية
            ودية، فإن النزاعات سوف تستمر تقديمه إلى القضاء الجزائري المختص.
          </TermsParagraph>
          <TermsSubHeading>8. التعديل</TermsSubHeading>

          <TermsParagraph>
            يجوز لشركة Hanuut Express تعديل أو تحديث هذه الشروط والأحكام على في
            أي وقت دون إشعار مسبق.
          </TermsParagraph>
        </TermsAndConditions>
      )}
    </>
  );
};

export default SatimTermsAndConditions;
