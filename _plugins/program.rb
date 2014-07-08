require 'net/http'
require 'json'
require 'nokogiri'

class ProgramTag < Liquid::Tag

  def render context
    data = JSON.parse File.read '_program.json'
    @html = Nokogiri::HTML::DocumentFragment.parse ""
    Nokogiri::HTML::Builder.with(@html) do |html|
      html.div(:class => 'tab-content program-matrix program') do
        data.each do |e|
          html.div(:class => 'programpont row') do 
            html.div(:class => 'col-md-2 idopont') do
              html.span { html.text "#{e['start']} - #{e['end']}" }
              html.br 
              html.text e['location']
              html.br
              html.br
              html.em { html.text e['partner'] }
            end
            html.div(:class => 'col-md-8') do
              html.h3 { html.text e['name'] }
              html.p { html.text e['description'] }
            end
            html.div(:class => 'col-md-2 visible-lg visible-md') do
              html.img(:src => e['logo'], :class => 'img-responsive')
            end
          end
        end
      end
    end
    @html.to_html
  end



  Liquid::Template.register_tag('dyn_program', self)
end
