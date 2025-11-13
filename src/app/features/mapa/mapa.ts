import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss']
})
export class Mapa implements OnInit {

  private mapa!: L.Map;
  private centroid: L.LatLngExpression = [-25.546944, -54.586389]; // Foz do Iguaçu
  private userMarker: L.Marker | null = null;

  private initMap(): void {

    // Configuração dos ícones
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
    });

    this.mapa = L.map('map', {
      center: this.centroid,
      zoom: 12,
      zoomControl: false
    });

    // Adiciona controle de zoom
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.mapa);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.mapa);

    // Adiciona botão de localização
    this.adicionarBotaoLocalizacao();

    setTimeout(() => {
      this.mapa.invalidateSize();
    }, 100);

    L.marker([-25.546944, -54.586389]).addTo(this.mapa)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();
  }

  private adicionarBotaoLocalizacao(): void {
    const botaoLocalizacao = (L.control as any)({ position: 'bottomleft' });

    botaoLocalizacao.onAdd = () => {
      const div = L.DomUtil.create('div', 'botao-localizacao');
      div.innerHTML = `
        <button class="btn-localizacao" title="Minha Localização">
          📍
        </button>
      `;
      
      L.DomEvent.on(div, 'click', (e) => {
        L.DomEvent.stopPropagation(e);
        this.irParaMinhaLocalizacao();
      });

      return div;
    };

    botaoLocalizacao.addTo(this.mapa);
  }

  private irParaMinhaLocalizacao(): void {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    // Mostra loading no botão
    const botao = document.querySelector('.btn-localizacao') as HTMLElement;
    if (botao) botao.innerHTML = '⏳';

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        // Sucesso - obtém coordenadas
        const userCoords: L.LatLngExpression = [
          posicao.coords.latitude,
          posicao.coords.longitude
        ];

        // Move o mapa para a localização do usuário
        this.mapa.setView(userCoords, 15);

        // Remove marcador anterior se existir
        if (this.userMarker) {
          this.mapa.removeLayer(this.userMarker);
        }

        // Adiciona novo marcador na localização do usuário
        this.userMarker = L.marker(userCoords)
          .addTo(this.mapa)
          .bindPopup('Você está aqui!')
          .openPopup();

        // Adiciona círculo de precisão
        L.circle(userCoords, {
          color: 'blue',
          fillColor: '#1e90ff',
          fillOpacity: 0.2,
          radius: posicao.coords.accuracy
        }).addTo(this.mapa);

        // Restaura ícone do botão
        if (botao) botao.innerHTML = '📍';

      },
      (erro) => {
        // Erro na geolocalização
        console.error('Erro na geolocalização:', erro);
        
        // Restaura ícone do botão
        if (botao) botao.innerHTML = '📍';

        let mensagem = 'Não foi possível obter sua localização. ';
        
        switch (erro.code) {
          case erro.PERMISSION_DENIED:
            mensagem += 'Permissão negada pelo usuário.';
            break;
          case erro.POSITION_UNAVAILABLE:
            mensagem += 'Localização indisponível.';
            break;
          case erro.TIMEOUT:
            mensagem += 'Tempo de busca pela localização esgotado.';
            break;
          default:
            mensagem += 'Erro desconhecido.';
        }
        
        alert(mensagem);
      },
      {
        enableHighAccuracy: true,    // Tenta usar GPS
        timeout: 10000,              // 10 segundos de timeout
        maximumAge: 600000           // Cache de 10 minutos
      }
    );
  }

  // Opcional: Localização automática ao iniciar
  private localizacaoAutomatica(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          const userCoords: L.LatLngExpression = [
            posicao.coords.latitude,
            posicao.coords.longitude
          ];
          this.mapa.setView(userCoords, 13);
        },
        (erro) => {
          console.log('Localização automática falhou, usando Foz do Iguaçu');
          // Mantém Foz do Iguaçu como fallback
        }
      );
    }
  }

  ngOnInit(): void {
    this.initMap();
    setTimeout(() => this.localizacaoAutomatica(), 2000);
  }
}